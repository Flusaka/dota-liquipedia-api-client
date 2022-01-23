import fetch from 'node-fetch';
import { IRequestClient, IRequestOptions } from '../interfaces/request';

export class NodeFetchRequestClient implements IRequestClient {
    get(request: IRequestOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            fetch(request.url, {
                headers: {
                    'User-Agent': request.headers.userAgent
                }
            })
        });
    }
}