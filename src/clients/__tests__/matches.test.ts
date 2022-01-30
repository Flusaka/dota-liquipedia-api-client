import * as fs from 'fs';
import { mock, mockFn } from 'jest-mock-extended';
import { MatchClient } from '../matches';
import IRequestClient from '../../interfaces/request';
import { MatchStatus } from '../../interfaces/matches';

const matchesTestHtml = {
    'valid': fs.readFileSync('./src/clients/__tests__/test-matches-response.html'),
    'invalidHomeTeam': fs.readFileSync('./src/clients/__tests__/test-matches-response-invalid-home-team.html'),
    'invalidAwayTeam': fs.readFileSync('./src/clients/__tests__/test-matches-response-invalid-away-team.html'),
    'invalidBestOf': fs.readFileSync('./src/clients/__tests__/test-matches-response-invalid-best-of.html'),
    'invalidMatchTime': fs.readFileSync('./src/clients/__tests__/test-matches-response-invalid-match-time.html')
};

const mockRequestClient = mock<IRequestClient>();

const matchClient = new MatchClient(mockRequestClient);
const mockMatchClient = mock<MatchClient>({
    getLiveMatches: matchClient.getLiveMatches,
    getUpcomingMatches: matchClient.getUpcomingMatches,
    getMatches: mockFn().mockReturnValue(Promise.resolve([
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
    test('Match Client calls get on the IRequestClient when getMatches is called', () => {
        matchClient.getMatches();
        expect(mockRequestClient.get).toBeCalled();
    });

    test('Match Client returns correct amount of matches for valid data', async () => {
        mockRequestClient.get.mockReturnValue(Promise.resolve({
            parse: {
                displaytitle: '',
                text: {
                    '*': matchesTestHtml['valid'].toString()
                }
            }
        }));
        const matches = await matchClient.getMatches();
        expect(matches).toHaveLength(1);
    });

    test('Match Client ignores match data if the home team name is missing', async () => {
        mockRequestClient.get.mockReturnValue(Promise.resolve({
            parse: {
                displaytitle: '',
                text: {
                    '*': matchesTestHtml['invalidHomeTeam'].toString()
                }
            }
        }));
        const matches = await matchClient.getMatches();
        expect(matches).toHaveLength(0);
    });

    test('Match Client ignores match data if the away team name is missing', async () => {
        mockRequestClient.get.mockReturnValue(Promise.resolve({
            parse: {
                displaytitle: '',
                text: {
                    '*': matchesTestHtml['invalidAwayTeam'].toString()
                }
            }
        }));
        const matches = await matchClient.getMatches();
        expect(matches).toHaveLength(0);
    });

    test('Match Client ignores match data if the best of value is missing', async () => {
        mockRequestClient.get.mockReturnValue(Promise.resolve({
            parse: {
                displaytitle: '',
                text: {
                    '*': matchesTestHtml['invalidBestOf'].toString()
                }
            }
        }));
        const matches = await matchClient.getMatches();
        expect(matches).toHaveLength(0);
    });

    test('Match Client ignores match data if the match time value is missing', async () => {
        mockRequestClient.get.mockReturnValue(Promise.resolve({
            parse: {
                displaytitle: '',
                text: {
                    '*': matchesTestHtml['invalidMatchTime'].toString()
                }
            }
        }));
        const matches = await matchClient.getMatches();
        expect(matches).toHaveLength(0);
    });

    test('Match Client rejects Promise if IRequestClient errors for any reason, propagating the reason upwards, when calling getMatches', () => {
        expect.assertions(1);
        const errorReason = "TestError";
        mockRequestClient.get.mockReturnValue(Promise.reject(errorReason));
        expect(matchClient.getMatches()).rejects.toEqual(errorReason);
    });

    test('Match Client rejects Promise if IRequestClient errors for any reason, propagating the reason upwards, when calling getUpcomingMatches', () => {
        expect.assertions(1);
        const errorReason = "TestError";
        mockRequestClient.get.mockReturnValue(Promise.reject(errorReason));
        expect(matchClient.getUpcomingMatches()).rejects.toEqual(errorReason);
    });

    test('Match Client rejects Promise if IRequestClient errors for any reason, propagating the reason upwards, when calling getLiveMatches', () => {
        expect.assertions(1);
        const errorReason = "TestError";
        mockRequestClient.get.mockReturnValue(Promise.reject(errorReason));
        expect(matchClient.getLiveMatches()).rejects.toEqual(errorReason);
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