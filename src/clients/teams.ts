import { IRequestClient } from '../interfaces/request';
import { ITeam, ITeamClient } from '../interfaces/teams';
import { parse } from 'node-html-parser';

export class TeamClient implements ITeamClient {
    private requestClient: IRequestClient;

    constructor(requestClient: IRequestClient) {
        this.requestClient = requestClient;
    }

    public getTeam(teamName: string): Promise<ITeam> {
        return new Promise((resolve, reject) => {
            const encodedTeamName = teamName.replace(/ /g, '_');
            this.requestClient.get({
                url: `https://liquipedia.net/dota2/api.php?action=parse&origin=*&format=json&page=${encodedTeamName}`,
                headers: {
                    acceptEncoding: 'gzip',
                    userAgent: 'Dota Liquipedia API Client'
                }
            }).then((response) => {
                const jsonResponse = JSON.parse(response);
                const html = parse(jsonResponse.parse.text);
                console.log(html);
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
            }).catch(reason => {
                reject(reason);
            });
        });
    }
}
