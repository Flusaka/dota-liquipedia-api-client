export type IRequestHeaders = {
    acceptEncoding?: 'gzip';
    userAgent?: string;
}

export type IRequestOptions = {
    url: string;
    headers: IRequestHeaders;
}

export type IResponse = {
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
