import { MatchClient } from './clients/matches';
import { TeamClient } from './clients/teams';
import { AxiosRequestClient } from './common/axios_request';
import { ITeam } from './interfaces/teams';
import { IMatch } from './interfaces/matches';

/**
 * Central access point to retrieve data for Dota 2 from Liquipedia
 * @class DotaLiquipediaClient
 */
export default class DotaLiquipediaClient {
    private requestClient: AxiosRequestClient;
    private matchesClient: MatchClient;
    private teamClient: TeamClient;

    /**
     * Create a new DotaLiquipediaClient
     * Creates the sub-clients for requests, matches and teams
     * @param userAgent The user agent ID that will be sent to Liquipedia
     */
    constructor(userAgent: string) {
        this.requestClient = new AxiosRequestClient(userAgent);
        this.matchesClient = new MatchClient(this.requestClient);
        this.teamClient = new TeamClient(this.requestClient);
    }

    /**
     * Get a specific team by team name (e.g. Team Liquid, OG etc.)
     * @param teamName The name of the team for which to retrieve info
     * @returns An awaitable Promise which will contain the Team data, if successful
     */
    public getTeamByName(teamName: string): Promise<ITeam> {
        return this.teamClient.getTeam(teamName);
    }

    /**
     * Get all matches whether they are upcoming or live
     * @returns An awaitable Promise which will contain the list of Matches, if successful
     */
    public getMatches(): Promise<Array<IMatch>> {
        return this.matchesClient.getMatches();
    }

    /**
     * Get all upcoming matches
     * @returns An awaitable Promise which will contain the list of upcoming Matches, if successful
     */
    public getUpcomingMatches(): Promise<Array<IMatch>> {
        return this.matchesClient.getUpcomingMatches();
    }

    /**
     * Get all live matches
     * @returns An awaitable Promise which will contain the list of live Matches, if successful
     */
    public getLiveMatches(): Promise<Array<IMatch>> {
        return this.matchesClient.getLiveMatches();
    }
}

export { MatchClient, TeamClient, ITeam, IMatch };