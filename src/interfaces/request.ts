export interface IRequestHeaders {
    acceptEncoding: 'gzip';
    userAgent: string;
}

export interface IRequestOptions {
    url: string;
    headers: IRequestHeaders;
}

export interface IRequestClient {
    get(request: IRequestOptions): Promise<string>;
}
