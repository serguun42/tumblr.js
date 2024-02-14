export class Client {
	/**
	 * Package version
	 * @readonly
	 */
	static readonly version: "4.1.1";
	/**
	 * Creates a Tumblr API client using the given options
	 *
	 * @param  {import('./types').Options} [options] - client options
	 */
	constructor(options?: import("./types").Options);
	/**
	 * Package version
	 *
	 * @type {typeof Client.version}
	 * @readonly
	 */
	readonly version: typeof Client.version;
	/**
	 * Base URL to API requests
	 * @type {string}
	 * @readonly
	 */
	readonly baseUrl: string;
	/**
	 * Performs a GET request
	 *
	 * @template {any} T
	 * @param  {string} apiPath - URL path for the request
	 * @param  {Record<string, any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	getRequest<T extends any>(apiPath: string, params?: Record<string, any>): Promise<T>;
	/**
	 * Performs a POST request
	 *
	 * @template {any} T
	 * @param  {string} apiPath - URL path for the request
	 * @param  {Record<string,any>} [params]
	 *
	 * @return {Promise<T>} Promise if no callback was provided
	 */
	postRequest<T extends any>(apiPath: string, params?: Record<string, any>): Promise<T>;
	/**
	 * Performs a PUT request
	 *
	 * @template {any} T
	 * @param  {string} apiPath - URL path for the request
	 * @param  {Record<string,any>} [params]
	 *
	 * @return {Promise<T>} Promise if no callback was provided
	 */
	putRequest<T extends any>(apiPath: string, params?: Record<string, any>): Promise<T>;
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
	createPost<T extends any>(
		blogIdentifier: string,
		params: import("./types").NpfReblogParams | import("./types").NpfPostParams
	): Promise<T>;
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
	editPost<T extends any>(
		blogIdentifier: string,
		postId: string,
		params: import("./types").NpfReblogParams | import("./types").NpfPostParams
	): Promise<T>;
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
	createLegacyPost<T extends any>(blogIdentifier: string, params: Record<string, any>): Promise<T>;
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
	editLegacyPost<T extends any>(blogIdentifier: string, params: Record<string, any>): Promise<T>;
	/**
	 * Likes a post as the authenticating user
	 *
	 * @template {any} T
	 * @param  {string} postId - ID of post to like
	 * @param  {string} reblogKey - Reblog key of post to like
	 *
	 * @return {Promise<T>}
	 */
	likePost<T extends any>(postId: string, reblogKey: string): Promise<T>;
	/**
	 * Unlikes a post as the authenticating user
	 *
	 * @template {any} T
	 * @param  {string} postId - ID of post to like
	 * @param  {string} reblogKey - Reblog key of post to like
	 *
	 * @return {Promise<T>}
	 */
	unlikePost<T extends any>(postId: string, reblogKey: string): Promise<T>;
	/**
	 * Follows a blog as the authenticating user
	 *
	 * @template {any} T
	 * @param  {{url: string}|{email:string}} params - parameters sent with the request
	 *
	 * @return {Promise<T>}
	 */
	followBlog<T extends any>(
		params:
			| {
					url: string;
			  }
			| {
					email: string;
			  }
	): Promise<T>;
	/**
	 * Unfollows a blog as the authenticating user
	 *
	 * @template {any} T
	 * @param  {{url: string}} params - parameters sent with the request
	 *
	 * @return {Promise<T>}
	 */
	unfollowBlog<T extends any>(params: { url: string }): Promise<T>;
	/**
	 * Deletes a given post
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {string} postId - Post ID to delete
	 *
	 * @return {Promise<T>}
	 */
	deletePost<T extends any>(blogIdentifier: string, postId: string): Promise<T>;
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
	reblogPost<T extends any>(blogIdentifier: string, params: Record<string, any>): Promise<T>;
	/**
	 * Gets information about a given blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{'fields[blogs]'?: string}} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	blogInfo<T extends any>(
		blogIdentifier: string,
		params?: {
			"fields[blogs]"?: string;
		}
	): Promise<T>;
	/**
	 * Gets the likes for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{limit?: number; offset?: number; before?: number; after?: number}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogLikes<T extends any>(
		blogIdentifier: string,
		params?: {
			limit?: number;
			offset?: number;
			before?: number;
			after?: number;
		}
	): Promise<T>;
	/**
	 * Gets the followers for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{limit?: number; offset?: number}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogFollowers<T extends any>(
		blogIdentifier: string,
		params?: {
			limit?: number;
			offset?: number;
		}
	): Promise<T>;
	/** @type {import('./types').BlogPosts<Client>} */
	blogPosts: import("./types").BlogPosts<Client>;
	/**
	 * Gets the queue for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{limit?: number; offset?: number; filter?: 'text'|'raw'}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogQueue<T extends any>(
		blogIdentifier: string,
		params?: {
			limit?: number;
			offset?: number;
			filter?: "text" | "raw";
		}
	): Promise<T>;
	/**
	 * Gets the drafts for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{before_id?: number; filter?: PostFormatFilter}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogDrafts<T extends any>(
		blogIdentifier: string,
		params?: {
			before_id?: number;
			filter?: import("./types").PostFormatFilter;
		}
	): Promise<T>;
	/**
	 * Gets the submissions for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {{offset?: number; filter?: PostFormatFilter}} [params] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogSubmissions<T extends any>(
		blogIdentifier: string,
		params?: {
			offset?: number;
			filter?: import("./types").PostFormatFilter;
		}
	): Promise<T>;
	/**
	 * Gets the avatar URL for a blog
	 *
	 * @template {any} T
	 * @param  {string} blogIdentifier - blog name or URL
	 * @param  {16|24|30|40|48|64|96|128|512} [sizeOrCallback] - optional data sent with the request
	 *
	 * @return {Promise<T>}
	 */
	blogAvatar<T extends any>(
		blogIdentifier: string,
		sizeOrCallback?: 16 | 24 | 30 | 40 | 48 | 64 | 96 | 128 | 512
	): Promise<T>;
	/**
	 * Gets information about the authenticating user and their blogs
	 *
	 * @template {any} T
	 * @return {Promise<T>}
	 */
	userInfo<T extends any>(): Promise<T>;
	/**
	 * Gets the dashboard posts for the authenticating user
	 *
	 * @template {any} T
	 * @param  {Record<string,any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	userDashboard<T extends any>(params?: Record<string, any>): Promise<T>;
	/**
	 * Gets the blogs the authenticating user follows
	 *
	 * @template {any} T
	 * @param  {{limit?: number; offset?: number;}} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	userFollowing<T extends any>(params?: { limit?: number; offset?: number }): Promise<T>;
	/**
	 * Gets the likes for the authenticating user
	 *
	 * @template {any} T
	 * @param  {{limit?: number; offset?: number; before?: number; after?: number}} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	userLikes<T extends any>(params?: { limit?: number; offset?: number; before?: number; after?: number }): Promise<T>;
	/**
	 * Gets posts tagged with the specified tag
	 *
	 * @template {any} T
	 * @param  {string} tag - The tag on the posts you'd like to retrieve
	 * @param  {Record<string,any>} [params] - query parameters
	 *
	 * @return {Promise<T>}
	 */
	taggedPosts<T extends any>(tag: string, params?: Record<string, any>): Promise<T>;
	#private;
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
export function createClient(options?: import("./types").Options): Client;
//# sourceMappingURL=tumblr.d.ts.map
