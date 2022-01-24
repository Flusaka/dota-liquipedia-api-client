import { TeamClient } from './clients/teams';
import { AxiosRequestClient } from './common/axios_request';

const teamClient = new TeamClient(new AxiosRequestClient());
teamClient.getTeam("Team Liquid").then(team => {
    console.log(team.name);
    console.log(team.captain);
    for (const member of team.roster) {
        console.log(`${member.nickname} - ${member.fullName} - ${member.joinDate} - ${member.position}`)
    }
}).catch(reason => {
    console.error(reason);
});

export { TeamClient };