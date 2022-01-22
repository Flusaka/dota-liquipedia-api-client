import { IRequestClient } from '../interfaces/request';
import { ITeam, ITeamClient } from '../interfaces/teams';

export class TeamClient implements ITeamClient {
    private requestClient: IRequestClient;

    constructor(requestClient: IRequestClient) {
        this.requestClient = requestClient;
    }

    public getTeam(teamName: string): Promise<ITeam> {
        return new Promise((resolve) => {
            const encodedTeamName = teamName.replace(/ /g, '_');
            this.requestClient.get({
                url: `https://liquipedia.net/dota2/api.php?action=parse&origin=*&format=json&page=${encodedTeamName}`,
                headers: {
                    acceptEncoding: 'gzip',
                    userAgent: 'Dota Liquipedia API Client'
                }
            }).then((response) => {
                console.log(response);
                resolve({
                    name: teamName,
                    region: "EU",
                    roster: [{
                        fullName: "Full Name",
                        joinDate: new Date(),
                        nickname: "Nickname",
                        position: 1
                    }]
                });
            })
        });
    }
}
