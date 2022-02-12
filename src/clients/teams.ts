import IRequestClient, { IResponse } from '../interfaces/request';
import { ITeam, ITeamClient, ITeamMember } from '../interfaces/teams';
import { parse } from 'node-html-parser';

/**
 * Client for retrieving Team data specifically
 * @class TeamClient
 */
export class TeamClient implements ITeamClient {
    private requestClient: IRequestClient;

    /**
     * 
     * @param requestClient Create a new TeamClient
     * @param requestClient Instance of a type of IRequestClient this will use to retrieve data from Liquipedia
     */
    constructor(requestClient: IRequestClient) {
        this.requestClient = requestClient;
    }

    /**
     * Get the details of a team by name
     * @param teamName The name of the team as it would appear in a URL on Liquipedia
     * @returns An object containing all team details from Liquipedia
     */
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

    /**
    * Parses the HTML response from Liquipedia into an ITeam object
    * @param response The response object from the Liquipedia server, containing the HTML to parse
    * @returns An ITeam object populated with details parsed from the HTML
    */
    private _parseTeam(response: IResponse): ITeam {
        const htmlRoot = parse(response.parse.text['*']);

        let teamRegion = '';
        let teamCaptain: string | undefined;

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

    /**
     * Clean up the full name of a player to remove some parts that aren't needed
     * @param fullName The full name value of the player
     * @returns Cleaned up name with certain characters removed
     */
    private _cleanupName(fullName: string): string {
        const cleanedUp = /\((.+)\)/.exec(fullName);
        return cleanedUp ? cleanedUp[1] : fullName;
    }
}
