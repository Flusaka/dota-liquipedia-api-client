import { MatchClient } from './clients/matches';
import { TeamClient } from './clients/teams';
import { AxiosRequestClient } from './common/axios_request';
import { ITeam } from './interfaces/teams';
import { IMatch } from './interfaces/matches';

export class DotaLiquipediaClient {
    private requestClient: AxiosRequestClient;
    private matchesClient: MatchClient;
    private teamClient: TeamClient;

    constructor(userAgent: string) {
        this.requestClient = new AxiosRequestClient(userAgent);
        this.matchesClient = new MatchClient(this.requestClient);
        this.teamClient = new TeamClient(this.requestClient);
    }

    public getTeamByName(teamName: string): Promise<ITeam> {
        return this.teamClient.getTeam(teamName);
    }

    public getMatches(): Promise<Array<IMatch>> {
        return this.matchesClient.getMatches();
    }

    public getUpcomingMatches(): Promise<Array<IMatch>> {
        return this.matchesClient.getUpcomingMatches();
    }

    public getLiveMatches(): Promise<Array<IMatch>> {
        return this.matchesClient.getLiveMatches();
    }
}

export { MatchClient, TeamClient, ITeam, IMatch };