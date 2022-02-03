# Dota 2 Liquipedia API Client

An API client to read data from the [Liquipedia Wiki for the video game Dota 2](https://liquipedia.net/dota2/). Currently it can retrieve teams and matches (upcoming, live or all).

## Installation

Install the Dota 2 Liquipedia API Client via npm or your package manager of choice
```bash
npm i --save dota-liquipedia-api-client
```

## How To Use

Import the main client file and class, create an instance and initialise it with your User Agent name

```typescript
import DotaLiquipediaClient from 'dota-liquipedia-api-client';

const client = new DotaLiquipediaClient('MyUserAgent');
```
You can then use this to make any of the calls required for your purposes.

All API functions return a Promise, and therefore can be used through either the traditional Promise mechanism, or with the await syntax.

### Teams

The data structure(s) for teams look like the following:

```typescript
type ITeamMember = {
    nickname: string;
    fullName: string;
    joinDate: Date;
    position: string;
}

type ITeam = {
    name: string;
    roster: ITeamMember[];
    region: string;
    captain?: string;
}
```

You can retrieve any team by name how the page would be named on the Liquipedia Wiki, without underscores (i.e. "Team Liquid", "OG")

```typescript
client.getTeamByName("Team Liquid").then(team => {
    console.log(team);
}).catch(error => {
    console.log(error);
});
```

### Matches

The data structure(s) for matches look like the following:

```typescript
type IMatchTeam = {
    name: string;
    shortName?: string;
    currentScore?: number;
}

enum MatchStatus {
    Upcoming,
    Live,
    Completed
}

type IMatch = {
    homeTeam: IMatchTeam;
    awayTeam: IMatchTeam;
    bestOf: number;
    status: MatchStatus;
    startTime?: Date;
    twitchStream?: string;
    tournamentName?: string;
}
```

All matches (live & upcoming) can be retrieved using the following function.

```typescript
client.getMatches().then(matches => {
    console.log(matches);
}).catch(error => {
    console.log(error);
});
```

Only upcoming matches can be retrieved using the following function.

```typescript
client.getUpcomingMatches().then(matches => {
    console.log(matches);
}).catch(error => {
    console.log(error);
});
```

Only live matches can be retrieved using the following function.

```typescript
client.getLiveMatches().then(matches => {
    console.log(matches);
}).catch(error => {
    console.log(error);
});
```