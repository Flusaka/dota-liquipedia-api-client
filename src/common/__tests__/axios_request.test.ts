import { AxiosRequestClient } from '../axios_request';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockImplementation(() => Promise.resolve({
    data: "{ \"parse\": { \"displaytitle\": \"Title\" } }"
}));

describe('Axios Request Client', () => {
    beforeEach(() => {
        mockedAxios.get.mockClear();
    });

    test('get function calls axios.get', () => {
        const client = new AxiosRequestClient('TestUserAgent');

        expect(mockedAxios.get).not.toHaveBeenCalled();
        return client.get({
            url: 'https://github.com'
        }).then(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        });
    });

    test('get function calls axios.get with url passed in and default headers when headers not specified', () => {
        const client = new AxiosRequestClient('TestUserAgent');

        expect(mockedAxios.get).not.toHaveBeenCalled();
        return client.get({
            url: 'https://github.com'
        }).then(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('https://github.com', {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'User-Agent': 'TestUserAgent'
                }
            });
        });
    });

    test('get function calls axios.get with url and acceptEncoding header specified in the request', () => {
        const client = new AxiosRequestClient('TestUserAgent');

        expect(mockedAxios.get).not.toHaveBeenCalled();
        return client.get({
            url: 'https://github.com',
            headers: {
                acceptEncoding: 'compress'
            }
        }).then(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('https://github.com', {
                headers: {
                    'Accept-Encoding': 'compress',
                    'User-Agent': 'TestUserAgent'
                }
            });
        });
    });

    test('get function calls axios.get with url and custom userAgent header specified in the request', () => {
        const client = new AxiosRequestClient("TestUserAgent");

        expect(mockedAxios.get).not.toHaveBeenCalled();
        return client.get({
            url: 'https://github.com',
            headers: {
                userAgent: 'OverrideUserAgent'
            }
        }).then(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('https://github.com', {
                headers: {
                    'Accept-Encoding': 'gzip',
                    'User-Agent': 'OverrideUserAgent'
                }
            });
        });
    });
});