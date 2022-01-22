import * as https from 'https';
import { IRequestClient, IRequestOptions } from '../interfaces/request';

export class HttpsRequestClient implements IRequestClient {
    get(request: IRequestOptions): Promise<string> {
        return new Promise((resolve, reject) => {
            https.get(request.url, {
                headers: {
                    'Accept-Encoding': request.headers.acceptEncoding,
                    'User-Agent': request.headers.userAgent
                }
            }, result => {
                result.setEncoding('utf8');
                result.on('data', data => {
                    resolve(data);
                });
                result.on('error', reject);
            });
        });
    }
}