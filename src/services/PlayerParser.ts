import { ColumnValue } from 'tedious';
import {
  DailyFantasyFuelPlayer,
  RotoGrindersPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
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

  parseRotoGrinderPlayerSalary(dollarAmount: string): number {
    const value: string = dollarAmount.split('$')[1].split('K')[0];
    return parseFloat(value) * 1000;
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
      const djNormalized: string = fullNameWithoutSuffix.replace('D.J.', 'DJ');
      const normalized: string = djNormalized.replace('D.K.', 'DK');
      return normalized;
    }
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
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FullName'),
            position
          ),
          salary: this.parseRotoGrinderPlayerSalary(
            this.retrieveColumnValue<string>(row, 'Salary')
          ),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          position: position,
          opponent: this.retrieveColumnValue<string>(row, 'Opponent'),
          projectedPoints: this.retrieveColumnValue<number>(
            row,
            'ProjectedPoints'
          ),
          projectedValue: this.retrieveColumnValue<number>(
            row,
            'ProjectedValue'
          ),
        };
        return rotoGrindersPlayer;
      }
    );
    return rotoGrindersPlayers;
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
          completionsOverAttempts: this.retrieveColumnValue<string>(
            row,
            'CompletionsOverAttempts'
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
