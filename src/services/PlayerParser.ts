import { ColumnValue } from 'tedious';
import {
  DailyFantasyFuelPlayer,
  RotoGrindersPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
  ProjectedPlayer,
  FantasyDataPlayer,
  DailyFantasyNerdPlayer,
} from '../models';

export class PlayerParser {
  parseNumberFirePlayerPosition(fullNameAndPosition: string): string {
    if (fullNameAndPosition.includes('D/ST')) {
      return 'DST';
    } else {
      const segments: string[] = fullNameAndPosition.split(
        String.fromCharCode(160)
      );
      return segments[segments.length - 1];
    }
  }

  parseNumberFirePlayerFullName(fullNameAndPosition: string): string {
    if (fullNameAndPosition.includes('D/ST')) {
      return fullNameAndPosition;
    } else {
      const segments: string[] = fullNameAndPosition.split(
        String.fromCharCode(160)
      );
      return segments[0];
    }
  }

  prepareDefenseName(fullName: string): string {
    // return team name for consistency with name on Draft Kings (e.g. Panthers)
    let defenseName: string = '';
    if (fullName.includes('Carolina') || fullName.includes('Panthers')) {
      defenseName = 'Panthers';
    } else if (
      fullName.includes('New Orleans') ||
      fullName.includes('Saints')
    ) {
      defenseName = 'Saints';
    } else if (
      fullName.includes('Tampa Bay') ||
      fullName.includes('Buccaneers')
    ) {
      defenseName = 'Buccaneers';
    } else if (fullName.includes('Atlanta') || fullName.includes('Falcons')) {
      defenseName = 'Falcons';
    } else if (fullName.includes('Green Bay') || fullName.includes('Packers')) {
      defenseName = 'Packers';
    } else if (fullName.includes('Minnesota') || fullName.includes('Vikings')) {
      defenseName = 'Vikings';
    } else if (fullName.includes('Detroit') || fullName.includes('Lions')) {
      defenseName = 'Lions';
    } else if (fullName.includes('Chicago') || fullName.includes('Bears')) {
      defenseName = 'Bears';
    } else if (
      fullName.includes('San Francisco') ||
      fullName.includes('49ers')
    ) {
      defenseName = '49ers';
    } else if (fullName.includes('Seattle') || fullName.includes('Seahawks')) {
      defenseName = 'Seahawks';
    } else if (fullName.includes('Arizona') || fullName.includes('Cardinals')) {
      defenseName = 'Cardinals';
    } else if (fullName.includes('Rams')) {
      defenseName = 'Rams';
    } else if (fullName.includes('Dallas') || fullName.includes('Cowboys')) {
      defenseName = 'Cowboys';
    } else if (
      fullName.includes('Philadelphia') ||
      fullName.includes('Eagles')
    ) {
      defenseName = 'Eagles';
    } else if (fullName.includes('Giants')) {
      defenseName = 'Giants';
    } else if (fullName.includes('Washington') || fullName.includes('WAS')) {
      defenseName = 'WAS';
    } else if (
      fullName.includes('New England') ||
      fullName.includes('Patriots')
    ) {
      defenseName = 'Patriots';
    } else if (fullName.includes('Jets')) {
      defenseName = 'Jets';
    } else if (fullName.includes('Buffalo') || fullName.includes('Bills')) {
      defenseName = 'Bills';
    } else if (fullName.includes('Miami') || fullName.includes('Dolphins')) {
      defenseName = 'Dolphins';
    } else if (
      fullName.includes('Indianapolis') ||
      fullName.includes('Colts')
    ) {
      defenseName = 'Colts';
    } else if (fullName.includes('Houston') || fullName.includes('Texans')) {
      defenseName = 'Texans';
    } else if (
      fullName.includes('Jacksonville') ||
      fullName.includes('Jaguars')
    ) {
      defenseName = 'Jaguars';
    } else if (fullName.includes('Tennessee') || fullName.includes('Titans')) {
      defenseName = 'Titans';
    } else if (fullName.includes('Denver') || fullName.includes('Broncos')) {
      defenseName = 'Broncos';
    } else if (
      fullName.includes('Kansas City') ||
      fullName.includes('Chiefs')
    ) {
      defenseName = 'Chiefs';
    } else if (fullName.includes('Las Vegas') || fullName.includes('Raiders')) {
      defenseName = 'Raiders';
    } else if (fullName.includes('Chargers')) {
      defenseName = 'Chargers';
    } else if (
      fullName.includes('Pittsburgh') ||
      fullName.includes('Steelers')
    ) {
      defenseName = 'Steelers';
    } else if (fullName.includes('Cleveland') || fullName.includes('Browns')) {
      defenseName = 'Browns';
    } else if (fullName.includes('Baltimore') || fullName.includes('Ravens')) {
      defenseName = 'Ravens';
    } else if (
      fullName.includes('Cincinnati') ||
      fullName.includes('Bengals')
    ) {
      defenseName = 'Bengals';
    }
    return defenseName;
  }

  retrieveColumnValue<T>(row: ColumnValue[], columnName: string): T {
    return row.find(
      (column: ColumnValue) => column.metadata.colName === columnName
    )?.value as T;
  }

  normalizePlayerFullName(fullName: string, position: string): string {
    // ensure player name is simply first and last name, no Jrs, IIIs, etc. which differ across providers
    if (position === 'DST') {
      return this.prepareDefenseName(fullName);
    } else {
      const segments: string[] = fullName.split(' ');
      const fullNameWithoutSuffix: string = segments[0]
        .concat(' ')
        .concat(segments[1]);
      // ensure DJs and DKs are normalized
      const normalized: string = fullNameWithoutSuffix
        .replace('D.J.', 'DJ')
        .replace('D.K.', 'DK')
        .replace('T.J.', 'TJ')
        .replace('K.J.', 'KJ')
        .replace('P.J.', 'PJ')
        .replace('J.K.', 'JK');
      return normalized;
    }
  }

  parseProjectedPlayers(tableData: ColumnValue[][]): ProjectedPlayer[] {
    const projectedPlayers: ProjectedPlayer[] = tableData.map(
      (row: ColumnValue[]) => {
        const projectedPlayer: ProjectedPlayer = {
          firstName: this.retrieveColumnValue<string>(row, 'FirstName'),
          lastName: this.retrieveColumnValue<string>(row, 'LastName'),
          playerId: this.retrieveColumnValue<string>(row, 'PlayerId'),
          position: this.retrieveColumnValue<string>(row, 'Position'),
          salary: this.retrieveColumnValue<number>(row, 'Salary'),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          opponent: this.retrieveColumnValue<string>(row, 'Opponent'),
          rotoGrindersProjection: this.retrieveColumnValue<number>(
            row,
            'RotoGrindersProjection'
          ),
          numberFireProjection: this.retrieveColumnValue<number>(
            row,
            'NumberFireProjection'
          ),
          dailyFantasyFuelProjection: this.retrieveColumnValue<number>(
            row,
            'DailyFantasyFuelProjection'
          ),
          fantasyDataProjection: this.retrieveColumnValue<number>(
            row,
            'FantasyDataProjection'
          ),
          dailyFantasyNerdProjection: this.retrieveColumnValue<number>(
            row,
            'DailyFantasyNerdProjection'
          ),
          projectedPoints: this.retrieveColumnValue<number>(
            row,
            'ProjectedPoints'
          ),
          projectedValue: this.retrieveColumnValue<number>(
            row,
            'ProjectedValue'
          ),
          averagePPG: this.retrieveColumnValue<number>(row, 'AveragePPG'),
        };
        return projectedPlayer;
      }
    );
    return projectedPlayers;
  }

  parseDraftKingsAvailablePlayers(
    tableData: ColumnValue[][]
  ): DraftKingsAvailablePlayer[] {
    const draftKingsAvailablePlayers: DraftKingsAvailablePlayer[] = tableData.map(
      (row: ColumnValue[]) => {
        const position: string = this.retrieveColumnValue<string>(
          row,
          'Position'
        );
        const draftKingsAvailablePlayer: DraftKingsAvailablePlayer = {
          position: position,
          fullNamePlayerIdCombination: this.retrieveColumnValue<string>(
            row,
            'FullNamePlayerIdCombination'
          ),
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FullName'),
            position
          ),
          playerId: this.retrieveColumnValue<string>(row, 'PlayerId'),
          rosterPosition: this.retrieveColumnValue<string>(
            row,
            'RosterPosition'
          ),
          salary: this.retrieveColumnValue<number>(row, 'Salary'),
          gameInfo: this.retrieveColumnValue<string>(row, 'GameInfo'),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          averagePPG: this.retrieveColumnValue<number>(row, 'AveragePPG'),
        };
        return draftKingsAvailablePlayer;
      }
    );
    return draftKingsAvailablePlayers;
  }

  parseRotoGrindersPlayers(tableData: ColumnValue[][]): RotoGrindersPlayer[] {
    const rotoGrindersPlayers: RotoGrindersPlayer[] = tableData.map(
      (row: ColumnValue[]) => {
        const position: string = this.retrieveColumnValue<string>(
          row,
          'Position'
        );
        const rotoGrindersPlayer: RotoGrindersPlayer = {
          playerId: this.retrieveColumnValue<string>(row, 'PlayerId'),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          opponent: this.retrieveColumnValue<string>(row, 'Opponent'),
          position: position,
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FullName'),
            position
          ),
          projectedPoints: this.retrieveColumnValue<number>(
            row,
            'ProjectedPoints'
          ),
          projectedOwnership: this.retrieveColumnValue<number>(
            row,
            'ProjectedOwnership'
          ),
          ceiling: this.retrieveColumnValue<number>(row, 'Ceiling'),
          floor: this.retrieveColumnValue<number>(row, 'Floor'),
          minExposure: this.retrieveColumnValue<number>(row, 'MinExposure'),
          maxExposure: this.retrieveColumnValue<number>(row, 'MaxExposure'),
        };
        return rotoGrindersPlayer;
      }
    );
    return rotoGrindersPlayers;
  }

  parseFantasyDataPlayers(tableData: ColumnValue[][]): FantasyDataPlayer[] {
    const fantasyDataPlayers: FantasyDataPlayer[] = tableData.map(
      (row: ColumnValue[]) => {
        const position: string = this.retrieveColumnValue<string>(
          row,
          'Position'
        );
        const fantasyDataPlayer: FantasyDataPlayer = {
          rank: this.retrieveColumnValue<number>(row, 'Rank'),
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FullName'),
            position
          ),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          position: position,
          week: this.retrieveColumnValue<number>(row, 'Week'),
          opponent: this.retrieveColumnValue<string>(row, 'Opponent'),
          passingYds: this.retrieveColumnValue<number>(row, 'PassingYds'),
          passingTds: this.retrieveColumnValue<number>(row, 'PassingTds'),
          passingInts: this.retrieveColumnValue<number>(row, 'PassingInts'),
          rushingYds: this.retrieveColumnValue<number>(row, 'RushingYds'),
          rushingTds: this.retrieveColumnValue<number>(row, 'RushingTds'),
          receptions: this.retrieveColumnValue<number>(row, 'Receptions'),
          receivingYds: this.retrieveColumnValue<number>(row, 'ReceivingYds'),
          receivingTds: this.retrieveColumnValue<number>(row, 'ReceivingTds'),
          sacks: this.retrieveColumnValue<number>(row, 'Sacks'),
          interceptions: this.retrieveColumnValue<number>(row, 'Interceptions'),
          fumblesForced: this.retrieveColumnValue<number>(row, 'FumblesForced'),
          fumblesRecovered: this.retrieveColumnValue<number>(
            row,
            'FumblesRecovered'
          ),
          projectedPoints: this.retrieveColumnValue<number>(
            row,
            'ProjectedPoints'
          ),
          averagePPG: this.retrieveColumnValue<number>(row, 'AveragePPG'),
        };
        return fantasyDataPlayer;
      }
    );
    return fantasyDataPlayers;
  }

  parseDailyFantasyNerdPlayers(
    tableData: ColumnValue[][]
  ): DailyFantasyNerdPlayer[] {
    const dailyFantasyNerdPlayers: DailyFantasyNerdPlayer[] = tableData.map(
      (row: ColumnValue[]) => {
        const retrievedPosition: string = this.retrieveColumnValue<string>(
          row,
          'Position'
        );
        const position = retrievedPosition === 'D' ? 'DST' : retrievedPosition;
        const dailyFantasyNerdPlayer: DailyFantasyNerdPlayer = {
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FullName'),
            position
          ),
          likes: this.retrieveColumnValue<number>(row, 'Likes'),
          injuryStatus: this.retrieveColumnValue<string>(row, 'InjuryStatus'),
          position: position,
          salary: this.retrieveColumnValue<number>(row, 'Salary'),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          opponent: this.retrieveColumnValue<string>(row, 'Opponent'),
          vegasPoints: this.retrieveColumnValue<number>(row, 'VegasPoints'),
          vegasSpread: this.retrieveColumnValue<string>(row, 'VegasSpread'),
          defensePassingYdsPerGame: this.retrieveColumnValue<string>(
            row,
            'DefensePassingYdsPerGame'
          ),
          defenseRushingYdsPerGame: this.retrieveColumnValue<string>(
            row,
            'DefenseRushingYdsPerGame'
          ),
          defenseVsPosition: this.retrieveColumnValue<string>(
            row,
            'DefenseVsPosition'
          ),
          last3PassingAtt: this.retrieveColumnValue<number>(
            row,
            'Last3PassingAtt'
          ),
          seasonPassingAtt: this.retrieveColumnValue<number>(
            row,
            'SeasonPassingAtt'
          ),
          projectedPassingAtt: this.retrieveColumnValue<number>(
            row,
            'ProjectedPassingAtt'
          ),
          redZonePassingAtt: this.retrieveColumnValue<number>(
            row,
            'RedZonePassingAtt'
          ),
          yardsPerPassingAtt: this.retrieveColumnValue<number>(
            row,
            'YardsPerPassingAtt'
          ),
          last3RushingAtt: this.retrieveColumnValue<number>(
            row,
            'Last3RushingAtt'
          ),
          seasonRushingAtt: this.retrieveColumnValue<number>(
            row,
            'SeasonRushingAtt'
          ),
          projectedRushingAtt: this.retrieveColumnValue<number>(
            row,
            'ProjectedRushingAtt'
          ),
          redZoneRushingAtt: this.retrieveColumnValue<number>(
            row,
            'RedZoneRushingAtt'
          ),
          yardsPerRushingAtt: this.retrieveColumnValue<number>(
            row,
            'YardsPerRushingAtt'
          ),
          last3Targets: this.retrieveColumnValue<number>(row, 'Last3Targets'),
          seasonTargets: this.retrieveColumnValue<number>(row, 'SeasonTargets'),
          projectedTargets: this.retrieveColumnValue<number>(
            row,
            'ProjectedTargets'
          ),
          redZoneTargets: this.retrieveColumnValue<number>(
            row,
            'RedZoneTargets'
          ),
          yardsPerTarget: this.retrieveColumnValue<number>(
            row,
            'YardsPerTarget'
          ),
          projectedUsage: this.retrieveColumnValue<number>(
            row,
            'ProjectedUsage'
          ),
          last3PPG: this.retrieveColumnValue<number>(row, 'Last3PPG'),
          last16PPG: this.retrieveColumnValue<number>(row, 'Last16PPG'),
          averagePPG: this.retrieveColumnValue<number>(row, 'AveragePPG'),
          floor: this.retrieveColumnValue<number>(row, 'Floor'),
          ceiling: this.retrieveColumnValue<number>(row, 'Ceiling'),
          projectedPoints: this.retrieveColumnValue<number>(
            row,
            'ProjectedPoints'
          ),
          projectedValue: this.retrieveColumnValue<number>(
            row,
            'ProjectedValue'
          ),
          actualPoints: this.retrieveColumnValue<number>(row, 'ActualPoints'),
          actualValue: this.retrieveColumnValue<number>(row, 'ActualValue'),
        };
        return dailyFantasyNerdPlayer;
      }
    );
    return dailyFantasyNerdPlayers;
  }

  parseDailyFantasyFuelPlayers(
    tableData: ColumnValue[][]
  ): DailyFantasyFuelPlayer[] {
    const dailyFantasyFuelPlayers: DailyFantasyFuelPlayer[] = tableData.map(
      (row: ColumnValue[]) => {
        const position: string = this.retrieveColumnValue<string>(
          row,
          'Position'
        );
        const dailyFantasyFuelPlayer: DailyFantasyFuelPlayer = {
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FirstName')
              .concat(' ')
              .concat(this.retrieveColumnValue<string>(row, 'LastName')),
            position
          ),
          position: position,
          injuryStatus: this.retrieveColumnValue<string>(row, 'InjuryStatus'),
          gameDate: this.retrieveColumnValue<string>(row, 'GameDate'),
          slate: this.retrieveColumnValue<string>(row, 'Slate'),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          opponent: this.retrieveColumnValue<string>(row, 'Opponent'),
          spread: this.retrieveColumnValue<number>(row, 'Spread'),
          overUnder: this.retrieveColumnValue<number>(row, 'OverUnder'),
          impliedTeamScore: this.retrieveColumnValue<number>(
            row,
            'ImpliedTeamScore'
          ),
          salary: this.retrieveColumnValue<number>(row, 'Salary'),
          last5DvPRank: this.retrieveColumnValue<number>(row, 'Last5DvPRank'),
          last5PPGFloor: this.retrieveColumnValue<number>(row, 'Last5PPGFloor'),
          last5PPGAverage: this.retrieveColumnValue<number>(
            row,
            'Last5PPGAverage'
          ),
          last5PPGCeiling: this.retrieveColumnValue<number>(
            row,
            'Last5PPGCeiling'
          ),
          projectedPoints: this.retrieveColumnValue<number>(
            row,
            'ProjectedPoints'
          ),
          projectedValue: this.retrieveColumnValue<number>(
            row,
            'ProjectedValue'
          ),
          actualPoints: this.retrieveColumnValue<number>(row, 'ActualPoints'),
          actualValue: this.retrieveColumnValue<number>(row, 'ActualValue'),
        };
        return dailyFantasyFuelPlayer;
      }
    );
    return dailyFantasyFuelPlayers;
  }

  parseNumberFirePlayers(tableData: ColumnValue[][]): NumberFirePlayer[] {
    const numberFirePlayers: NumberFirePlayer[] = tableData
      .filter((row: ColumnValue[]) => {
        // filter out rows that don't contain player projections
        return this.retrieveColumnValue<number>(row, 'ProjectedValue') !== null;
      })
      .map((row: ColumnValue[]) => {
        const position: string = this.parseNumberFirePlayerPosition(
          this.retrieveColumnValue<string>(row, 'FullNameAndPosition')
        );
        const numberFirePlayer: NumberFirePlayer = {
          fullName: this.normalizePlayerFullName(
            this.parseNumberFirePlayerFullName(
              this.retrieveColumnValue<string>(row, 'FullNameAndPosition')
            ),
            position
          ),
          position: position,
          projectedPoints: this.retrieveColumnValue<number>(
            row,
            'ProjectedPoints'
          ),
          salary: this.retrieveColumnValue<number>(row, 'Salary'),
          projectedValue: this.retrieveColumnValue<number>(
            row,
            'ProjectedValue'
          ),
          completionsOverAtt: this.retrieveColumnValue<string>(
            row,
            'CompletionsOverAtt'
          ),
          passingYds: this.retrieveColumnValue<number>(row, 'PassingYds'),
          passingTds: this.retrieveColumnValue<number>(row, 'PassingTds'),
          passingInts: this.retrieveColumnValue<number>(row, 'PassingInts'),
          rushingAtt: this.retrieveColumnValue<number>(row, 'RushingAtt'),
          rushingYds: this.retrieveColumnValue<number>(row, 'RushingYds'),
          rushingTds: this.retrieveColumnValue<number>(row, 'RushingTds'),
          receptions: this.retrieveColumnValue<number>(row, 'Receptions'),
          receivingYds: this.retrieveColumnValue<number>(row, 'ReceivingYds'),
          receivingTds: this.retrieveColumnValue<number>(row, 'ReceivingTds'),
          targets: this.retrieveColumnValue<number>(row, 'Targets'),
        };
        return numberFirePlayer;
      });
    return numberFirePlayers;
  }
}
