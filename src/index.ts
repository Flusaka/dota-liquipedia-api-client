import { TeamClient } from './clients/teams';
import { NodeFetchRequestClient } from './common/node_fetch_request';

const teamClient = new TeamClient(new NodeFetchRequestClient());
teamClient.getTeam("Team Liquid").then(team => {
    console.log(team.name);
}).catch(reason => {
    console.error(reason);
});

export { TeamClient };