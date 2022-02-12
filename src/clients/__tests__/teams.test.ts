import * as fs from 'fs';
import { mock } from 'jest-mock-extended';
import { TeamClient } from '../teams';
import IRequestClient from '../../interfaces/request';
import { ITeam } from '../../interfaces/teams';

const matchesTestHtml = {
    'valid': fs.readFileSync('./src/clients/__tests__/test-team-response.html'),
};

const mockRequestClient = mock<IRequestClient>();
const teamClient = new TeamClient(mockRequestClient);

describe('Team Client', () => {
    test('Team Client calls get on the IRequestClient when getTeam is called', () => {
        teamClient.getTeam("Team Liquid");
        expect(mockRequestClient.get).toBeCalled();
    });

    test('Match Client returns correct team information for valid data', async () => {
        mockRequestClient.get.mockReturnValue(Promise.resolve({
            parse: {
                displaytitle: 'OG',
                text: {
                    '*': matchesTestHtml['valid'].toString()
                }
            }
        }));

        const expectedTeamDetails: ITeam = {
            name: 'OG',
            region: 'Europe',
            roster: [
                {
                    fullName: 'Artem Golubiev',
                    joinDate: new Date('2021-11-21'),
                    nickname: 'Yuragi',
                    position: '1'
                },
                {
                    fullName: 'Bozhidar Bogdanov',
                    joinDate: new Date('2021-11-21'),
                    nickname: 'bzm',
                    position: '2'
                },
                {
                    fullName: 'Ammar Al-Assaf',
                    joinDate: new Date('2021-11-21'),
                    nickname: 'ATF',
                    position: '3'
                },
                {
                    fullName: 'Tommy Le',
                    joinDate: new Date('2021-11-21'),
                    nickname: 'Taiga',
                    position: '4'
                },
                {
                    fullName: 'Mikhail Agatov',
                    joinDate: new Date('2021-11-21'),
                    nickname: 'Misha',
                    position: '5'
                }
            ],
            captain: 'Misha'
        };

        const team = await teamClient.getTeam('OG');
        expect(team).toBeDefined();
        expect(team.name).toStrictEqual(expectedTeamDetails.name);
        expect(team.region).toStrictEqual(expectedTeamDetails.region);
        expect(team.roster).toHaveLength(expectedTeamDetails.roster.length);
        expect(team.captain).toStrictEqual(expectedTeamDetails.captain);

        for (let i = 0; i < expectedTeamDetails.roster.length; ++i) {
            const expectedMember = expectedTeamDetails.roster[i];
            const member = team.roster[i];
            expect(member.fullName).toEqual(expectedMember.fullName);
            expect(member.joinDate).toEqual(expectedMember.joinDate);
            expect(member.nickname).toEqual(expectedMember.nickname);
            expect(member.position).toEqual(expectedMember.position);
        }
    });
});