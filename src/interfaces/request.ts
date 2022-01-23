export interface IRequestHeaders {
    acceptEncoding: 'gzip';
    userAgent: string;
}

export interface IRequestOptions {
    url: string;
    headers: IRequestHeaders;
}

export interface IResponse {
    parse: {
        displaytitle: string;
        text: {
            "*": string;
        }
    }
}

export interface IRequestClient {
    get(request: IRequestOptions): Promise<IResponse>;
}
