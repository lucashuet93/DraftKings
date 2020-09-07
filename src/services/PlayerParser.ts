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
      const defenseName: string = this.prepareNumberFireDefenseName(
        fullNameAndPosition
      );
      return defenseName;
    } else {
      const segments: string[] = fullNameAndPosition.split(
        String.fromCharCode(160)
      );
      return segments[0];
    }
  }

  prepareRotoGrindersDefenseName(fullName: string): string {
    // return team name for consistency with name on Draft Kings (e.g. Panthers)
    const segments: string[] = fullName.split(' ');
    return segments[segments.length - 1];
  }

  prepareNumberFireDefenseName(fullName: string): string {
    // return team name for consistency with name on Draft Kings (e.g. Panthers)
    switch (fullName) {
      case 'Carolina D/ST':
        return 'Panthers';
      case 'Tampa Bay D/ST':
        return 'Buccaneers';
      case 'Atlanta D/ST':
        return 'Falcons';
      case 'New Orleans D/ST':
        return 'Saints';
      case 'Minnesota D/ST':
        return 'Vikings';
      case 'Detroit D/ST':
        return 'Lions';
      case 'Green Bay D/ST':
        return 'Packers';
      case 'Chicago D/ST':
        return 'Bears';
      case 'Arizona D/ST':
        return 'Cardinals';
      case 'San Francisco D/ST':
        return '49ers';
      case 'Los Angeles Rams D/ST':
        return 'Rams';
      case 'Seattle D/ST':
        return 'Seahawks';
      case 'Philadelphia D/ST':
        return 'Eagles';
      case 'Dallas D/ST':
        return 'Cowboys';
      case 'New York Giants D/ST':
        return 'Giants';
      // missing Washington
      case 'Miami D/ST':
        return 'Dolphins';
      case 'New England D/ST':
        return 'Patriots';
      case 'New York Jets D/ST':
        return 'Jets';
      case 'Buffalo D/ST':
        return 'Bills';
      case 'Pittsburgh D/ST':
        return 'Steelers';
      case 'Cleveland D/ST':
        return 'Browns';
      case 'Baltimore D/ST':
        return 'Ravens';
      case 'Cincinnati D/ST':
        return 'Bengals';
      case 'Los Angeles Chargers D/ST':
        return 'Chargers';
      case 'Denver D/ST':
        return 'Broncos';
      case 'Kansas City D/ST':
        return 'Chiefs';
      // missing Las Vegas
      case 'Tennessee D/ST':
        return 'Titans';
      case 'Indianapolis D/ST':
        return 'Colts';
      case 'Houston D/ST':
        return 'Texans';
      case 'Jacksonville D/ST':
        return 'Jaguars';
      default:
        return '';
    }
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

  normalizePlayerFullName(fullName: string): string {
    // ensure player name is simply first and last name, no Jrs, IIIs, etc. which differ across providers
    const segments: string[] = fullName.split(' ');
    const fullNameWithoutSuffix: string = segments[0]
      .concat(' ')
      .concat(segments[1]);
    // ensure DJs and DKs are normalized
    const djNormalized: string = fullNameWithoutSuffix.replace('D.J.', 'DJ');
    const normalized: string = djNormalized.replace('D.K.', 'DK');
    return normalized;
  }

  parseDraftKingsAvailablePlayers(
    tableData: ColumnValue[][]
  ): DraftKingsAvailablePlayer[] {
    const draftKingsAvailablePlayers: DraftKingsAvailablePlayer[] = tableData.map(
      (row: ColumnValue[]) => {
        const draftKingsAvailablePlayer: DraftKingsAvailablePlayer = {
          position: this.retrieveColumnValue<string>(row, 'Position'),
          fullNamePlayerIdCombination: this.retrieveColumnValue<string>(
            row,
            'FullNamePlayerIdCombination'
          ),
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FullName')
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
        const rotoGrindersPlayer: RotoGrindersPlayer = {
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FullName')
          ),
          salary: this.parseRotoGrinderPlayerSalary(
            this.retrieveColumnValue<string>(row, 'Salary')
          ),
          team: this.retrieveColumnValue<string>(row, 'Team'),
          position: this.retrieveColumnValue<string>(row, 'Position'),
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
        const dailyFantasyFuelPlayer: DailyFantasyFuelPlayer = {
          fullName: this.normalizePlayerFullName(
            this.retrieveColumnValue<string>(row, 'FirstName')
              .concat(' ')
              .concat(this.retrieveColumnValue<string>(row, 'LastName'))
          ),
          position: this.retrieveColumnValue<string>(row, 'Position'),
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
        const numberFirePlayer: NumberFirePlayer = {
          fullName: this.normalizePlayerFullName(
            this.parseNumberFirePlayerFullName(
              this.retrieveColumnValue<string>(row, 'FullNameAndPosition')
            )
          ),
          position: this.parseNumberFirePlayerPosition(
            this.retrieveColumnValue<string>(row, 'FullNameAndPosition')
          ),
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
