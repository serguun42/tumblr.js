/*!
 * https://www.npmjs.com/package/tumblr.js
 * + modified by serguun42
 */

const FormData = require("form-data");
const http = require("node:http");
const https = require("node:https");
const { URL } = require("node:url");
const oauth = require("oauth");
const { ReadStream } = require("node:fs");

const API_BASE_URL = "https://api.tumblr.com"; // deliberately no trailing slash

class Client {
	/**
	 * Package version
	 * @readonly
	 */
	static version = "4.1.1";

	/**
	 * @typedef {import('./types').PostFormatFilter} PostFormatFilter
	 * @typedef {Map<string, ReadonlyArray<string>|string>} RequestData
	 * @typedef {{readonly auth:'none'}} NoneAuthCredentials
	 * @typedef {{readonly auth:'apiKey'; readonly apiKey:string}} ApiKeyCredentials
	 * @typedef {{readonly auth:'oauth1'; readonly consumer_key: string; readonly consumer_secret: string; readonly token: string; readonly token_secret: string }} OAuth1Credentials
	 * @typedef {NoneAuthCredentials|ApiKeyCredentials|OAuth1Credentials} Credentials
	 */

	/** @type {Credentials} */
	#credentials = { auth: "none" };

	/** @type {oauth.OAuth | null} */
	#oauthClient = null;

	/**
	 * Creates a Tumblr API client using the given options
	 *
	 * @param  {import('./types').Options} [options] - client options
	 */
	constructor(options) {
		/**
		 * Package version
		 *
		 * @type {typeof Client.version}
		 * @readonly
		 */
		this.version = Client.version;

		try {
			const url = new URL(options?.baseUrl ?? API_BASE_URL);

			if (url.pathname !== "/") {
				throw "pathname";
			}

			// url.searchParams.size is buggy in node 16, we have to look at keys
			if ([...url.searchParams.keys()].length) {
				throw "search";
			}

			if (url.username) {
				throw "username";
			}

			if (url.password) {
				throw "password";
			}

			if (url.hash) {
				throw "hash";
			}

			/**
			 * Base URL to API requests
			 * @type {string}
			 * @readonly
			 */
			this.baseUrl = url.toString();
		} catch (err) {
			switch (err) {
				case "pathname":
					throw new TypeError("baseUrl option must not include a pathname.");

				case "search":
					throw new TypeError("baseUrl option must not include search params (query).");

				case "username":
					throw new TypeError("baseUrl option must not include username.");

				case "password":
					throw new TypeError("baseUrl option must not include password.");

				case "hash":
					throw new TypeError("baseUrl option must not include hash.");

				default:
					throw new TypeError("Invalid baseUrl option provided.");
			}
		}

		if (options) {
			// If we have any of the optional credentials, we should have all of them.
			if (
				/** @type {const} */ (["consumer_secret", "token_secret", "token"]).some((propertyName) =>
					Object.prototype.hasOwnProperty.call(options, propertyName)
				)
			) {
				if (!options.consumer_key || typeof options.consumer_key !== "string") {
					throw new TypeError(
						`Provide consumer_key or all oauth credentials. Invalid consumer_key provided.`
					);
				}
				if (!options.consumer_secret || typeof options.consumer_secret !== "string") {
					throw new TypeError(
						`Provide consumer_key or all oauth credentials. Invalid consumer_secret provided.`
					);
				}
				if (!options.token || typeof options.token !== "string") {
					throw new TypeError(`Provide consumer_key or all oauth credentials. Invalid token provided.`);
				}
				if (!options.token_secret || typeof options.token_secret !== "string") {
					throw new TypeError(
						`Provide consumer_key or all oauth credentials. Invalid token_secret provided.`
					);
				}

				this.#credentials = {
					auth: "oauth1",
					consumer_key: options.consumer_key,
					consumer_secret: options.consumer_secret,
					token: options.token,
					token_secret: options.token_secret
				};
			}

			// consumer_key can be provided alone to use for api_key authentication
			else if (options.consumer_key) {
				if (typeof options.consumer_key !== "string") {
					throw new TypeError("You must provide a consumer_key.");
				}
				this.#credentials = { auth: "apiKey", apiKey: options.consumer_key };
			}
		}

		/** @type {oauth.OAuth | null} */
		this.#oauthClient =
			this.#credentials.auth === "oauth1"
				? new oauth.OAuth(
						"",
						"",
						this.#credentials.consumer_key,
						this.#credentials.consumer_secret,
						"1.0",
						null,
						"HMAC-SHA1"
					)
				: null;
	}

	/**
	 * Performs a GET request
	 *
	 * @template {any} T
	 * @param  {string} apiPath - URL path for the request
	 * @param  {Record<string, any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	getRequest(apiPath, params) {
		const [url, requestData] = this.#prepareRequestUrlAndRequestData(apiPath, "GET", params);

		return this.#makeRequest(url, "GET", requestData);
	}

	/**
	 * @template T
	 *
	 * @param {URL} url
	 * @param {'GET'|'POST'|'PUT'} method request method
	 * @param {RequestData | null} data
	 *
	 * @returns {Promise<T>}
	 */
	#makeRequest(url, method, data) {
		/** @type {(value: any) => void} */
		let resolve;
		/** @type {(reason?: any) => void} */
		let reject;

		const promise = new Promise((promiseResolve, promiseReject) => {
			resolve = promiseResolve;
			reject = promiseReject;
		});

		/** @type {(err: Error | null, responseBody: Record<string, any> | null) => void} */
		const callback = (e, responseBody) => {
			if (e) {
				reject(e);
				return;
			}

			resolve(responseBody);
		};

		const httpModel = url.protocol === "http" ? http : https;

		if (this.#credentials.auth === "apiKey") {
			url.searchParams.set("api_key", this.#credentials.apiKey);
		}

		const request = httpModel.request(url, { method });
		request.setHeader("User-Agent", "tumblr.js/" + Client.version);
		request.setHeader("Accept", "application/json");

		if (this.#oauthClient && this.#credentials.auth === "oauth1") {
			const authHeader = this.#oauthClient.authHeader(
				url.toString(),
				this.#credentials.token,
				this.#credentials.token_secret,
				method
			);
			request.setHeader("Authorization", authHeader);
		}

		/** @type {FormData?} */
		let form;

		if (data) {
			// We use multipart/form-data if we have media to upload
			// We may also send JSON data in a multipart/form-data JSON field
			if (data.has("data") || data.has("data64") || data.has("json")) {
				form = new FormData();

				for (const [key, value] of data.entries()) {
					// NPF endpoints use a special "json" field
					if (key === "json" && typeof value === "string") {
						form.append(key, value, { contentType: "application/json" });
						continue;
					}

					// Transform array values to our expected form-data format:
					// key: [ 'a', 'b' ]
					// key[0]=a
					// key[1]=b
					if (Array.isArray(value)) {
						for (const [index, arrValue] of (Array.isArray(value) ? value : [value]).entries()) {
							form.append(`${key}[${index}]`, arrValue);
						}
						continue;
					}

					// Some types of of values error when form-data appends them
					// or when they're piped into the request buffer.
					if (typeof value === "boolean") {
						form.append(key, JSON.stringify(value));
						continue;
					}

					form.append(key, value);
				}

				for (const [key, value] of Object.entries(form.getHeaders())) {
					request.setHeader(key, value);
				}

				form.pipe(request);
			} else {
				// Otherwise, we'll JSON encode the body
				const requestBody = JSON.stringify(Object.fromEntries(data.entries()));
				request.setHeader("Content-Type", "application/json");
				request.setHeader("Content-Length", requestBody.length);
				request.write(requestBody);
			}
		}

		let responseData = "";
		let callbackCalled = false;

		request.on("response", (response) => {
			response.setEncoding("utf8");
			response.on("data", (chunk) => {
				responseData += chunk;
			});
			response.on("end", () => {
				if (callbackCalled) return;
				callbackCalled = true;

				/** @type {Record<string, any>} */
				let parsedData;
				try {
					parsedData = JSON.parse(responseData);
				} catch (err) {
					callback(new Error(`API error (malformed API response): ${responseData}`));
					return;
				}

				const statusCode = /** @type {number} */ (response.statusCode);
				if (statusCode < 200 || statusCode > 399) {
					const errString = parsedData?.meta?.msg ?? parsedData?.error ?? "unknown";
					return callback(new Error(`API error: ${response.statusCode} ${errString}`));
				}

				if (parsedData?.response) return callback(null, parsedData.response);

				return callback(new Error("API error (malformed API response): " + parsedData));
			});
		});

		request.on("error", (e) => {
			if (callbackCalled) return;
			callbackCalled = true;

			callback(e);
		});

		if (form) form.on("end", () => request.end());
		else request.end();

		return promise;
	}

	/**
	 * Prepare request URL and data
	 *
	 * GET requests move all data into URL search.
	 * Other requests move data to the request body.
	 *
	 * @param  {string} apiPath - URL path for the request
	 * @param {'GET'|'POST'|'PUT'} method request method
	 * @param  {Record<string,any>} [params]
	 *
	 * @returns {[URL, null | Map<string,any>]}
	 */
	#prepareRequestUrlAndRequestData(apiPath, method, params) {
		const url = new URL(apiPath, this.baseUrl);

		if (method === "GET") {
			if (params) {
				for (const [key, value] of Object.entries(params)) {
					if (Array.isArray(value)) {
						// Transform array values to our expected search string format:
						// tag: [ 'first', 'second' ]
						// tag%5B0%5D=first&tag%5B1%5D=second
						for (const [index, arrayValue] of value.entries()) {
							url.searchParams.append(`${key}[${index}]`, arrayValue);
						}
					} else {
						url.searchParams.set(key, value);
					}
				}
			}
			return [url, null];
		}

		const requestData = new Map(params ? Object.entries(params) : undefined);

		for (const [key, value] of url.searchParams.entries()) {
			if (!requestData.has(key)) {
				requestData.set(key, value);
			}
		}

		// Clear the search params
		url.search = "";
		return [url, requestData.size ? requestData : null];
	}

	/**
	 * Performs a POST request
	 *
	 * @template {any} T
	 * @param  {string} apiPath - URL path for the request
	 * @param  {Record<string, any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	postRequest(apiPath, params) {
		const [url, requestData] = this.#prepareRequestUrlAndRequestData(apiPath, "POST", params);

		return this.#makeRequest(url, "POST", requestData);
	}

	/**
	 * Performs a PUT request
	 *
	 * @template {any} T
	 * @param  {string} apiPath - URL path for the request
	 * @param  {Record<string, any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	putRequest(apiPath, params) {
		const [url, requestData] = this.#prepareRequestUrlAndRequestData(apiPath, "PUT", params);

		return this.#makeRequest(url, "PUT", requestData);
	}

	/**
	 * Create or reblog an NPF post
	 *
	 * @see {@link https://www.tumblr.com/docs/en/api/v2#posts---createreblog-a-post-neue-post-format|API Docs}
	 *
	 * @example
	 * await client.createPost(blogName, {
	 *   content: [
	 *     {
	 *       type: 'image',
	 *       // Node's fs module, e.g. `import fs from 'node:fs';`
	 *       media: fs.createReadStream(new URL('./image.jpg', import.meta.url)),
	 *       alt_text: '…',
	 *     },
	 *   ],
	 * });
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {import('./types').NpfReblogParams | import('./types').NpfPostParams } params
	 *
	 * @return {Promise<T>}
	 */
	createPost(blogIdentifier, params) {
		const data = this.#transformNpfParams(params);
		return this.postRequest(`/v2/blog/${blogIdentifier}/posts`, data);
	}

	/**
	 * Edit an NPF post
	 *
	 * @see {@link https://www.tumblr.com/docs/en/api/v2#postspost-id---editing-a-post-neue-post-format|API Docs}
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {string} postId - Post ID
	 * @param  {import('./types').NpfReblogParams | import('./types').NpfPostParams } params
	 *
	 * @return {Promise<T>}
	 */
	editPost(blogIdentifier, postId, params) {
		const data = this.#transformNpfParams(params);
		return this.putRequest(`/v2/blog/${blogIdentifier}/posts/${postId}`, data);
	}

	/**
	 * @param  {import('./types').NpfReblogParams | import('./types').NpfPostParams } params
	 */
	#transformNpfParams({ tags, content, ...params }) {
		/** @type {Map<string, ReadStream>} */
		const mediaStreams = new Map();

		const transformedContent = content.map((block, index) => {
			if (block.media && block.media instanceof ReadStream) {
				mediaStreams.set(String(index), block.media);
				return {
					...block,
					media: { identifier: String(index) }
				};
			}
			return block;
		});

		const transformedTags = Array.isArray(tags) && { tags: tags.join(",") };

		const transformedParams = {
			...params,
			...transformedTags,
			content: transformedContent
		};

		const transformed = mediaStreams.size
			? {
					json: JSON.stringify(transformedParams),
					...Object.fromEntries(mediaStreams.entries())
				}
			: transformedParams;

		return transformed;
	}

	/**
	 * Creates a post on the given blog.
	 *
	 * @deprecated Legacy post creation methods are deprecated. Use NPF methods.
	 *
	 * @see {@link https://www.tumblr.com/docs/api/v2#posting|API Docs}
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {Record<string,any>} params
	 *
	 * @return {Promise<T>}
	 */
	createLegacyPost(blogIdentifier, params) {
		return this.postRequest(`/v2/blog/${blogIdentifier}/post`, params);
	}

	/**
	 * Edits a given post
	 *
	 * @deprecated Legacy post creation methods are deprecated. Use NPF methods.
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {Record<string,any>} params
	 *
	 * @return {Promise<T>}
	 */
	editLegacyPost(blogIdentifier, params) {
		return this.postRequest(`/v2/blog/${blogIdentifier}/post/edit`, params);
	}

	/**
	 * Likes a post as the authenticating user
	 *
	 * @template {any} T
	 * @param  {string} postId - ID of post to like
	 * @param  {string} reblogKey - Reblog key of post to like
	 *
	 * @return {Promise<T>}
	 */
	likePost(postId, reblogKey) {
		return this.postRequest("/v2/user/like", { id: postId, reblog_key: reblogKey });
	}

	/**
	 * Unlikes a post as the authenticating user
	 *
	 * @template {any} T
	 * @param  {string} postId - ID of post to like
	 * @param  {string} reblogKey - Reblog key of post to like
	 *
	 * @return {Promise<T>}
	 */
	unlikePost(postId, reblogKey) {
		return this.postRequest("/v2/user/unlike", { id: postId, reblog_key: reblogKey });
	}

	/**
	 * Follows a blog as the authenticating user
	 *
	 * @template {any} T
	 * @param  {{url: string}|{email:string}} params - parameters sent with the request
	 *
	 * @return {Promise<T>}
	 */
	followBlog(params) {
		return this.postRequest("/v2/user/follow", params);
	}

	/**
	 * Unfollows a blog as the authenticating user
	 *
	 * @template {any} T
	 * @param  {{url: string}} params - parameters sent with the request
	 *
	 * @return {Promise<T>}
	 */
	unfollowBlog(params) {
		return this.postRequest("/v2/user/unfollow", params);
	}

	/**
	 * Deletes a given post
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {string} postId - Post ID to delete
	 *
	 * @return {Promise<T>}
	 */
	deletePost(blogIdentifier, postId) {
		return this.postRequest(`/v2/blog/${blogIdentifier}/post/delete`, { id: postId });
	}

	/**
	 * Reblogs a given post
	 *
	 * @deprecated Legacy post creation methods are deprecated. Use NPF methods.
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {Record<string,any>} params - parameters sent with the request
	 *
	 * @return {Promise<T>}
	 */
	reblogPost(blogIdentifier, params) {
		return this.postRequest(`/v2/blog/${blogIdentifier}/post/reblog`, params);
	}

	/**
	 * Gets information about a given blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{'fields[blogs]'?: string}} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	blogInfo(blogIdentifier, params) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/info`, params);
	}

	/**
	 * Gets the likes for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{limit?: number; offset?: number; before?: number; after?: number}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogLikes(blogIdentifier, params) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/likes`, params);
	}

	/**
	 * Gets the followers for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{limit?: number; offset?: number}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogFollowers(blogIdentifier, params) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/followers`, params);
	}

	/** @type {import('./types').BlogPosts<Client>} */
	// @ts-expect-error The legacy signature makes this hard to type correctly.
	blogPosts = function blogPosts(blogIdentifier, params) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/posts`, params);
	};

	/**
	 * Gets the queue for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{limit?: number; offset?: number; filter?: 'text'|'raw'}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogQueue(blogIdentifier, params) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/posts/queue`, params);
	}

	/**
	 * Gets the drafts for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{before_id?: number; filter?: PostFormatFilter}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogDrafts(blogIdentifier, params) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/posts/draft`, params);
	}

	/**
	 * Gets the submissions for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{offset?: number; filter?: PostFormatFilter}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogSubmissions(blogIdentifier, params) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/posts/submission`, params);
	}

	/**
	 * Gets the avatar URL for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {16|24|30|40|48|64|96|128|512} [size] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogAvatar(blogIdentifier, size) {
		return this.getRequest(`/v2/blog/${blogIdentifier}/avatar${size ? `/${size}` : ""}`);
	}

	/**
	 * Gets information about the authenticating user and their blogs
	 *
	 * @template {any} T
	 * @return {Promise<T>}
	 */
	userInfo() {
		return this.getRequest("/v2/user/info");
	}

	/**
	 * Gets the dashboard posts for the authenticating user
	 *
	 * @template {any} T
	 * @param  {Record<string,any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	userDashboard(params) {
		return this.getRequest("/v2/user/dashboard", params);
	}

	/**
	 * Gets the blogs the authenticating user follows
	 *
	 * @template {any} T
	 * @param  {{limit?: number; offset?: number;}} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	userFollowing(params) {
		return this.getRequest("/v2/user/following", params);
	}

	/**
	 * Gets the likes for the authenticating user
	 *
	 * @template {any} T
	 * @param  {{limit?: number; offset?: number; before?: number; after?: number}} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	userLikes(params) {
		return this.getRequest("/v2/user/likes", params);
	}

	/**
	 * Gets posts tagged with the specified tag
	 *
	 * @template {any} T
	 * @param  {string} tag - The tag on the posts you'd like to retrieve
	 * @param  {Record<string,any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	taggedPosts(tag, params) {
		return this.getRequest("/v2/tagged", { ...params, tag });
	}
}

/**
 * Creates a Tumblr Client
 *
 * @param  {import('./types').Options} [options] - client options
 *
 * @return {Client} {@link Client} instance
 *
 * @see {@link Client}
 */
function createClient(options) {
	return new Client(options);
}

module.exports = {
	Client,
	createClient
};
