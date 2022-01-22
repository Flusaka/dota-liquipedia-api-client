import { TeamClient } from './clients/teams';
import { HttpsRequestClient } from './common/https_request';

const teamClient = new TeamClient(new HttpsRequestClient());
teamClient.getTeam("Team Liquid").then(team => {
    console.log(team.name);
});

export { TeamClient };