import axios from 'axios';
import IRequestClient, { IRequestOptions, IResponse } from '../interfaces/request';

export class AxiosRequestClient implements IRequestClient {
    private userAgent: string;

    constructor(userAgent: string) {
        this.userAgent = userAgent;
    }

    get(request: IRequestOptions): Promise<IResponse> {
        return new Promise((resolve, reject) => {
            axios.get(request.url, {
                headers: {
                    'Accept-Encoding': request.headers.acceptEncoding || 'gzip',
                    'User-Agent': request.headers.userAgent || this.userAgent
                }
            }).then(response => {
                resolve(response.data);
            }).catch(reject);
        });
    }
}