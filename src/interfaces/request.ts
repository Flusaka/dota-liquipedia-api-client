export type IRequestHeaders = {
    acceptEncoding?: 'gzip' | 'compress' | 'deflate' | 'br' | 'identity' | '*';
    userAgent?: string;
}

export type IRequestOptions = {
    url: string;
    headers?: IRequestHeaders;
}

export type IResponse = {
    parse: {
        displaytitle: string;
        text: {
            "*": string;
        }
    }
}

export default interface IRequestClient {
    get(request: IRequestOptions): Promise<IResponse>;
}
