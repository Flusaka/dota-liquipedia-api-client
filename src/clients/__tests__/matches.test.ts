import * as fs from 'fs';
import { mock } from 'jest-mock-extended';
import { MatchClient } from '../matches';
import IRequestClient, { IResponse } from '../../interfaces/request';

const matchesTestHtml = fs.readFileSync('./src/clients/__tests__/test-matches-response.html');

const mockRequestClient = mock<IRequestClient>();
mockRequestClient.get.mockImplementation((): Promise<IResponse> => {
    return Promise.resolve({
        parse: {
            displaytitle: 'Matches',
            text: {
                "*": matchesTestHtml.toString()
            }
        }
    })
});

describe('Match Client', () => {
    test('Match Client calls get when getMatches is invoked', () => {
        const matchClient = new MatchClient(mockRequestClient);
        matchClient.getMatches();

        expect(mockRequestClient.get).toBeCalled();
    });

    test('Match Client returns correct amount of matches for valid data', async () => {
        const matchClient = new MatchClient(mockRequestClient);
        const matches = await matchClient.getMatches();

        expect(matches).toHaveLength(4);
    });
});