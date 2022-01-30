import * as fs from 'fs';
import { mock, mockFn } from 'jest-mock-extended';
import { MatchClient } from '../matches';
import IRequestClient, { IResponse } from '../../interfaces/request';
import { IMatch, MatchStatus } from '../../interfaces/matches';

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

const matchClient = new MatchClient(mockRequestClient);
const mockMatchClient = mock<MatchClient>({
    getLiveMatches: matchClient.getLiveMatches,
    getUpcomingMatches: matchClient.getUpcomingMatches,
    getMatches: mockFn().mockReturnValue(Promise.resolve<IMatch[]>([
        {
            homeTeam: {
                name: 'Team Liquid'
            },
            awayTeam: {
                name: 'OG'
            },
            bestOf: 3,
            status: MatchStatus.Live
        },
        {
            homeTeam: {
                name: 'Team Nigma Galaxy'
            },
            awayTeam: {
                name: 'Tundra Esports'
            },
            bestOf: 3,
            status: MatchStatus.Upcoming
        }
    ]))
});

describe('Match Client', () => {
    test('Match Client calls get when getMatches is called', () => {
        matchClient.getMatches();
        expect(mockRequestClient.get).toBeCalled();
    });

    test('Match Client returns correct amount of matches for valid data', async () => {
        const matches = await matchClient.getMatches();
        expect(matches).toHaveLength(4);
    });

    test('Match Client returns only matches with status Upcoming when getUpcomingMatches is called', async () => {
        const matches = await mockMatchClient.getUpcomingMatches();
        expect(matches).toHaveLength(1);
        expect(matches.every(match => match.status == MatchStatus.Upcoming)).toBeTruthy();
    });

    test('Match Client returns only matches with status Live when getLiveMatches is called', async () => {
        const matches = await mockMatchClient.getLiveMatches();
        expect(matches).toHaveLength(1);
        expect(matches.every(match => match.status == MatchStatus.Live)).toBeTruthy();
    });
});