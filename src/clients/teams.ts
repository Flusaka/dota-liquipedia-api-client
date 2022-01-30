import IRequestClient, { IResponse } from '../interfaces/request';
import { ITeam, ITeamClient, ITeamMember } from '../interfaces/teams';
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
                url: `https://liquipedia.net/dota2/api.php?action=parse&origin=*&format=json&page=${encodedTeamName}`
            }).then((response) => {
                const team = this._parseTeam(response);
                resolve(team);
            }).catch(reason => {
                reject(reason);
            });
        });
    }

    private _parseTeam(response: IResponse): ITeam {
        const htmlRoot = parse(response.parse.text['*']);

        let teamRegion = '';
        let teamCaptain: string | undefined = '';

        // Parse team details
        const teamDetails = htmlRoot.querySelectorAll('.infobox-description');
        for (const detail of teamDetails) {
            const detailLabel = detail.innerText;
            const detailValue = detail.nextElementSibling.querySelector(':scope > a')?.innerText;
            if (detailLabel == 'Region:') {
                teamRegion = detailValue || '';
            }
            else if (detailLabel == 'Team Captain:') {
                teamCaptain = detailValue;
            }
        }

        // Parse roster
        const rosterRoot = htmlRoot.querySelector('.table-responsive > .wikitable-striped.roster-card')?.querySelectorAll('tr.Player');
        const roster: ITeamMember[] = [];
        if (rosterRoot) {
            for (const memberRoot of rosterRoot) {
                const nickname = memberRoot.querySelector('.ID #player a')?.innerText;
                const fullName = memberRoot.querySelector('.Name')?.innerText;
                const date = memberRoot.querySelector('div.Date')?.innerText
                const position = memberRoot.querySelector('.PositionWoTeam2')?.innerText;
                roster.push({
                    nickname: nickname || '',
                    fullName: fullName ? this._cleanupName(fullName) : '',
                    joinDate: date ? new Date(Date.parse(date.substring(0, 10))) : new Date(),
                    position: position || ''
                })
            }
        }

        return {
            name: response.parse.displaytitle,
            region: teamRegion,
            roster,
            captain: teamCaptain
        };
    }

    private _cleanupName(fullName: string): string {
        const cleanedUp = /\((.+)\)/.exec(fullName);
        return cleanedUp ? cleanedUp[1] : fullName;
    }
}
