export class Client {
    /**
     * Package version
     * @readonly
     */
    static readonly version: "4.0.2";
    /**
     * Creates a Tumblr API client using the given options
     *
     * @param  {import('./types').Options} [options] - client options
     */
    constructor(options?: import("./types").Options | undefined);
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
     * @param  {string} apiPath - URL path for the request
     * @param  {Record<string,any>|TumblrClientCallback} [paramsOrCallback] - query parameters
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    getRequest(apiPath: string, paramsOrCallback?: Record<string, any> | import("./types").TumblrClientCallback | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Performs a POST request
     *
     * @param  {string} apiPath - URL path for the request
     * @param  {Record<string,any>|TumblrClientCallback} [paramsOrCallback]
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback was provided
     */
    postRequest(apiPath: string, paramsOrCallback?: Record<string, any> | import("./types").TumblrClientCallback | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Performs a PUT request
     *
     * @param  {string} apiPath - URL path for the request
     * @param  {Record<string,any>|TumblrClientCallback} [paramsOrCallback]
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback was provided
     */
    putRequest(apiPath: string, paramsOrCallback?: Record<string, any> | import("./types").TumblrClientCallback | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * @deprecated Promises are returned if no callback is provided
     */
    returnPromises(): void;
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
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {import('./types').NpfReblogParams | import('./types').NpfPostParams } params
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    createPost(blogIdentifier: string, params: import('./types').NpfReblogParams | import('./types').NpfPostParams, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Edit an NPF post
     *
     * @see {@link https://www.tumblr.com/docs/en/api/v2#postspost-id---editing-a-post-neue-post-format|API Docs}
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {string} postId - Post ID
     * @param  {import('./types').NpfReblogParams | import('./types').NpfPostParams } params
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    editPost(blogIdentifier: string, postId: string, params: import('./types').NpfReblogParams | import('./types').NpfPostParams, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Creates a post on the given blog.
     *
     * @deprecated Legacy post creation methods are deprecated. Use NPF methods.
     *
     * @see {@link https://www.tumblr.com/docs/api/v2#posting|API Docs}
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {Record<string,any>} params
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    createLegacyPost(blogIdentifier: string, params: Record<string, any>, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Edits a given post
     *
     * @deprecated Legacy post creation methods are deprecated. Use NPF methods.
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {Record<string,any>} params
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    editLegacyPost(blogIdentifier: string, params: Record<string, any>, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Likes a post as the authenticating user
     *
     * @param  {string} postId - ID of post to like
     * @param  {string} reblogKey - Reblog key of post to like
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    likePost(postId: string, reblogKey: string, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Unlikes a post as the authenticating user
     *
     * @param  {string} postId - ID of post to like
     * @param  {string} reblogKey - Reblog key of post to like
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    unlikePost(postId: string, reblogKey: string, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Follows a blog as the authenticating user
     *
     * @param  {{url: string}|{email:string}} params - parameters sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    followBlog(params: {
        url: string;
    } | {
        email: string;
    }, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Unfollows a blog as the authenticating user
     *
     * @param  {{url: string}} params - parameters sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    unfollowBlog(params: {
        url: string;
    }, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Deletes a given post
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {string} postId - Post ID to delete
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    deletePost(blogIdentifier: string, postId: string, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Reblogs a given post
     *
     * @deprecated Legacy post creation methods are deprecated. Use NPF methods.
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {Record<string,any>} params - parameters sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    reblogPost(blogIdentifier: string, params: Record<string, any>, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets information about a given blog
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {{'fields[blogs]'?: string}|TumblrClientCallback} [paramsOrCallback] - query parameters
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    blogInfo(blogIdentifier: string, paramsOrCallback?: import("./types").TumblrClientCallback | {
        'fields[blogs]'?: string;
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the likes for a blog
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {{limit?: number; offset?: number; before?: number; after?: number}|TumblrClientCallback} [paramsOrCallback] - optional data sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    blogLikes(blogIdentifier: string, paramsOrCallback?: import("./types").TumblrClientCallback | {
        limit?: number;
        offset?: number;
        before?: number;
        after?: number;
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the followers for a blog
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {{limit?: number; offset?: number}|TumblrClientCallback} [paramsOrCallback] - optional data sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    blogFollowers(blogIdentifier: string, paramsOrCallback?: import("./types").TumblrClientCallback | {
        limit?: number;
        offset?: number;
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /** @type {import('./types').BlogPosts<Client>} */
    blogPosts: import('./types').BlogPosts<Client>;
    /**
     * Gets the queue for a blog
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {{limit?: number; offset?: number; filter?: 'text'|'raw'}|TumblrClientCallback} [paramsOrCallback] - optional data sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    blogQueue(blogIdentifier: string, paramsOrCallback?: import("./types").TumblrClientCallback | {
        limit?: number;
        offset?: number;
        filter?: 'text' | 'raw';
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the drafts for a blog
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {{before_id?: number; filter?: PostFormatFilter}|TumblrClientCallback} [paramsOrCallback] - optional data sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    blogDrafts(blogIdentifier: string, paramsOrCallback?: import("./types").TumblrClientCallback | {
        before_id?: number;
        filter?: import("./types").PostFormatFilter;
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the submissions for a blog
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {{offset?: number; filter?: PostFormatFilter}|TumblrClientCallback} [paramsOrCallback] - optional data sent with the request
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    blogSubmissions(blogIdentifier: string, paramsOrCallback?: import("./types").TumblrClientCallback | {
        offset?: number;
        filter?: import("./types").PostFormatFilter;
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the avatar URL for a blog
     *
     * @param  {string} blogIdentifier - blog name or URL
     * @param  {16|24|30|40|48|64|96|128|512|TumblrClientCallback} [sizeOrCallback] - optional data sent with the request
     * @param  {TumblrClientCallback} [maybeCallback] - invoked when the request completes
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    blogAvatar(blogIdentifier: string, sizeOrCallback?: import("./types").TumblrClientCallback | 16 | 24 | 30 | 40 | 48 | 64 | 96 | 128 | 512 | undefined, maybeCallback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets information about the authenticating user and their blogs
     *
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    userInfo(callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the dashboard posts for the authenticating user
     *
     * @param  {Record<string,any>|TumblrClientCallback} [paramsOrCallback] - query parameters
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    userDashboard(paramsOrCallback?: Record<string, any> | import("./types").TumblrClientCallback | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the blogs the authenticating user follows
     *
     * @param  {{limit?: number; offset?: number;}|TumblrClientCallback} [paramsOrCallback] - query parameters
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    userFollowing(paramsOrCallback?: import("./types").TumblrClientCallback | {
        limit?: number;
        offset?: number;
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets the likes for the authenticating user
     *
     * @param  {{limit?: number; offset?: number; before?: number; after?: number}|TumblrClientCallback} [paramsOrCallback] - query parameters
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    userLikes(paramsOrCallback?: import("./types").TumblrClientCallback | {
        limit?: number;
        offset?: number;
        before?: number;
        after?: number;
    } | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
    /**
     * Gets posts tagged with the specified tag
     *
     * @param  {string} tag - The tag on the posts you'd like to retrieve
     * @param  {Record<string,any>|TumblrClientCallback} [paramsOrCallback] - query parameters
     * @param  {TumblrClientCallback} [callback] **Deprecated** Omit the callback and use the promise form
     *
     * @return {Promise<any>|undefined} Promise if no callback is provided
     */
    taggedPosts(tag: string, paramsOrCallback?: Record<string, any> | import("./types").TumblrClientCallback | undefined, callback?: import("./types").TumblrClientCallback | undefined): Promise<any> | undefined;
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
export function createClient(options?: import("./types").Options | undefined): Client;
//# sourceMappingURL=tumblr.d.ts.map