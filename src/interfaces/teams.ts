export type ITeamMember = {
    nickname: string;
    fullName: string;
    joinDate: Date;
    position: string;
}

export type ITeam = {
    name: string;
    roster: ITeamMember[];
    region: string;
    captain?: string;
}

export interface ITeamClient {
    getTeam(teamName: string): Promise<ITeam>;
}