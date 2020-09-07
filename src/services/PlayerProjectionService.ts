import {
  ProjectedPlayer,
  DailyFantasyFuelPlayer,
  RotoGrindersPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
} from '../models';

export class PlayerProjectionService {
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
          // use unary operator to accurately round to 2 decimal places
          projectedValue: +(
            (averageProjectedPoints / draftKingsAvailablePlayer.salary) *
            1000
          ).toFixed(2),
          averagePPG: draftKingsAvailablePlayer.averagePPG,
        };
        return projectedPlayer;
      }
    );
    return projectedPlayers;
  }
}
