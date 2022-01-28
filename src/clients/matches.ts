import { parse } from 'node-html-parser';
import { IMatch, IMatchClient, MatchStatus } from '../interfaces/matches';
import { IRequestClient, IResponse } from '../interfaces/request';

export class MatchClient implements IMatchClient {
    private requestClient: IRequestClient;

    constructor(requestClient: IRequestClient) {
        this.requestClient = requestClient;
    }

    getMatches(): Promise<IMatch[]> {
        return new Promise((resolve, reject) => {
            this.requestClient.get({
                url: `https://liquipedia.net/dota2/api.php?action=parse&origin=*&format=json&page=Liquipedia:Upcoming_and_ongoing_matches`,
                headers: {}
            }).then(response => {
                const matches = this._parseMatches(response);
                resolve(matches);
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    getUpcomingMatches(): Promise<IMatch[]> {
        return new Promise((resolve, reject) => {
            this.getMatches().then(matches => {
                resolve(matches.filter(match => match.status == MatchStatus.Upcoming));
            }).catch(reason => {
                reject(reason);
            });
        });
    }
    getLiveMatches(): Promise<IMatch[]> {
        return new Promise((resolve, reject) => {
            this.getMatches().then(matches => {
                resolve(matches.filter(match => match.status == MatchStatus.Live));
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    private _parseMatches(response: IResponse): IMatch[] {
        const htmlRoot = parse(response.parse.text['*']);
        const matchDetailBoxes = htmlRoot.querySelectorAll('.infobox_matches_content');

        const matches: IMatch[] = [];
        for (const matchDetails of matchDetailBoxes) {
            const homeTeam = matchDetails.querySelector('.team-left > span');
            const homeTeamName = homeTeam?.getAttribute('data-highlightingclass')
            const homeTeamShortName = homeTeam?.querySelector('a')?.textContent;
            const awayTeam = matchDetails.querySelector('.team-right > span');
            const awayTeamName = awayTeam?.getAttribute('data-highlightingclass');
            const awayTeamShortName = awayTeam?.querySelector('a')?.textContent;
            const bestOf = matchDetails.querySelector('.versus abbr')?.textContent;
            const matchTimeContainer = matchDetails.querySelector('.timer-object');
            const matchTime = matchTimeContainer?.getAttribute('data-timestamp');
            const twitchStream = matchTimeContainer?.getAttribute('data-stream-twitch');
            const tournamentName = matchDetails.querySelector('.league-icon-small-image > a')?.getAttribute('title')

            if (!homeTeamName || !awayTeamName || !bestOf || !matchTime) {
                continue;
            }

            // Convert to UNIX timestamp (multiply by 1000)
            const startTimestamp = parseInt(matchTime) * 1000;
            const startTime = new Date(startTimestamp);
            let matchStatus = MatchStatus.Upcoming;
            if (startTimestamp < Date.now()) {
                matchStatus = MatchStatus.Live;
            }

            matches.push({
                homeTeam: {
                    name: homeTeamName,
                    shortName: homeTeamShortName
                },
                awayTeam: {
                    name: awayTeamName,
                    shortName: awayTeamShortName
                },
                bestOf: parseInt(bestOf.slice(2)),
                status: matchStatus,
                startTime,
                twitchStream: twitchStream?.toLowerCase().replace(/_/g, ''),
                tournamentName
            })
        }
        return matches;
    }
}