import { MatchClient } from './clients/matches';
import { TeamClient } from './clients/teams';
import { AxiosRequestClient } from './common/axios_request';

const requestClient = new AxiosRequestClient('Dota Liquipedia API Client');
const matchesClient = new MatchClient(requestClient);

const run = async () => {
    const matches = await matchesClient.getMatches();
    for (const match of matches) {
        console.log(`[${match.startTime}][${match.status.toString()}]: ${match.homeTeam.name} vs ${match.awayTeam.name} (Best of ${match.bestOf}), Tournament: ${match.tournamentName} on Stream: ${match.twitchStream}`);
    }
}

run();
// const teamClient = new TeamClient(requestClient);

// teamClient.getTeam("Team Liquid").then(team => {
//     console.log(team.name);
//     console.log(team.captain);
//     for (const member of team.roster) {
//         console.log(`${ member.nickname } - ${ member.fullName } - ${ member.joinDate } - ${ member.position }`)
//     }
// }).catch(reason => {
//     console.error(reason);
// });

export { TeamClient };