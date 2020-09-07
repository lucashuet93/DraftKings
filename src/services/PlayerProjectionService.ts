import { ColumnValue } from 'tedious';
import {
  ProjectedPlayer,
  DailyFantasyFuelPlayer,
  RotoGrindersPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
} from '../models';

export class PlayerProjectionService {
  private parseRotoGrinderPlayerSalary(dollarAmount: string): number {
    const value: string = dollarAmount.split('$')[1].split('K')[0];
    return parseFloat(value) * 1000;
  }

  private parseNumberFirePlayerPosition(fullNameAndPosition: string): string {
    let segments: string[] = fullNameAndPosition.split(
      String.fromCharCode(160)
    );
    return segments[segments.length - 1];
  }

  private parseNumberFirePlayerFullName(fullNameAndPosition: string): string {
    const segments: string[] = fullNameAndPosition.split(
      String.fromCharCode(160)
    );
    return segments[0];
  }

  retrieveColumnValue<T>(row: ColumnValue[], columnName: string): T {
    return row.find(
      (column: ColumnValue) => column.metadata.colName === columnName
    )?.value as T;
  }

  normalizePlayerFullName(fullName: string) {
    // ensure player name is simply first and last name, no Jrs etc. which differ across providers
    const segments: string[] = fullName.split(' ');
    return segments[0].concat(' ').concat(segments[1]);
  }

  projectPointTotal(
    rotoGrindersPlayer: RotoGrindersPlayer | undefined,
    numberFirePlayer: NumberFirePlayer | undefined,
    dailyFantasyFuelPlayer: DailyFantasyFuelPlayer | undefined
  ): number {
    let count: number = 0;
    let totalProjection: number = 0;
    if (rotoGrindersPlayer !== undefined) {
      count++;
      totalProjection += rotoGrindersPlayer.projectedPoints;
    }
    if (numberFirePlayer !== undefined) {
      count++;
      totalProjection += numberFirePlayer.projectedPoints;
    }
    if (dailyFantasyFuelPlayer !== undefined) {
      count++;
      totalProjection += dailyFantasyFuelPlayer.projectedPoints;
    }
    return count !== 0 ? totalProjection / count : 0;
  }

  projectPlayers(
    draftKingsAvailablePlayers: DraftKingsAvailablePlayer[],
    rotoGrindersPlayers: RotoGrindersPlayer[],
    numberFirePlayers: NumberFirePlayer[],
    dailyFantasyFuelPlayers: DailyFantasyFuelPlayer[]
  ): ProjectedPlayer[] {
    const projectedPlayers: ProjectedPlayer[] = draftKingsAvailablePlayers.map(
      (draftKingsAvailablePlayer: DraftKingsAvailablePlayer) => {
        const linkedRotoGrindersPlayer:
          | RotoGrindersPlayer
          | undefined = rotoGrindersPlayers.find(
          (player: RotoGrindersPlayer) => {
            return (
              player.fullName === draftKingsAvailablePlayer.fullName &&
              player.position === draftKingsAvailablePlayer.position
            );
          }
        );
        const linkedNumberFirePlayer:
          | NumberFirePlayer
          | undefined = numberFirePlayers.find((player: NumberFirePlayer) => {
          return (
            player.fullName === draftKingsAvailablePlayer.fullName &&
            player.position === draftKingsAvailablePlayer.position
          );
        });
        const linkedDailyFantasyFuelPlayer:
          | DailyFantasyFuelPlayer
          | undefined = dailyFantasyFuelPlayers.find(
          (player: DailyFantasyFuelPlayer) => {
            return (
              player.fullName === draftKingsAvailablePlayer.fullName &&
              player.position === draftKingsAvailablePlayer.position
            );
          }
        );
        const averageProjectedPoints = this.projectPointTotal(
          linkedRotoGrindersPlayer,
          linkedNumberFirePlayer,
          linkedDailyFantasyFuelPlayer
        );
        const projectedPlayer: ProjectedPlayer = {
          firstName: draftKingsAvailablePlayer.fullName.split(' ')[0],
          lastName: draftKingsAvailablePlayer.fullName.split(' ')[1],
          playerId: draftKingsAvailablePlayer.playerId,
          position: draftKingsAvailablePlayer.position,
          salary: draftKingsAvailablePlayer.salary,
          team: draftKingsAvailablePlayer.team,
          opponent: linkedRotoGrindersPlayer
            ? linkedRotoGrindersPlayer.opponent
            : linkedDailyFantasyFuelPlayer
            ? linkedDailyFantasyFuelPlayer.opponent
            : '',
          rotoGrindersProjection:
            linkedRotoGrindersPlayer !== undefined
              ? linkedRotoGrindersPlayer.projectedPoints
              : 0,
          numberFireProjection:
            linkedNumberFirePlayer !== undefined
              ? linkedNumberFirePlayer.projectedPoints
              : 0,
          dailyFantasyFuelProjection:
            linkedDailyFantasyFuelPlayer !== undefined
              ? linkedDailyFantasyFuelPlayer.projectedPoints
              : 0,
          projectedPoints: averageProjectedPoints,
          projectedValue:
            (averageProjectedPoints / draftKingsAvailablePlayer.salary) * 1000,
        };
        return projectedPlayer;
      }
    );
    return projectedPlayers;
  }

  createDraftKingsAvailablePlayers(
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

  createRotoGrindersPlayers(tableData: ColumnValue[][]): RotoGrindersPlayer[] {
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

  createDailyFantasyFuelPlayers(
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

  createNumberFirePlayers(tableData: ColumnValue[][]): NumberFirePlayer[] {
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
