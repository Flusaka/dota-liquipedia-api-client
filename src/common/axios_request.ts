import axios from 'axios';
import { IRequestClient, IRequestOptions, IResponse } from '../interfaces/request';

export class AxiosRequestClient implements IRequestClient {
    get(request: IRequestOptions): Promise<IResponse> {
        return new Promise((resolve, reject) => {
            axios.get(request.url, {
                headers: {
                    'Accept-Encoding': request.headers.acceptEncoding,
                    'User-Agent': request.headers.userAgent
                }
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    }
}