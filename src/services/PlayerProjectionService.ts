import {
  ProjectedPlayer,
  DailyFantasyFuelPlayer,
  RotoGrindersPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
  FantasyDataPlayer,
  DailyFantasyNerdPlayer,
} from '../models';

export class PlayerProjectionService {
  projectPointTotal(
    rotoGrindersPlayer: RotoGrindersPlayer | undefined,
    numberFirePlayer: NumberFirePlayer | undefined,
    dailyFantasyFuelPlayer: DailyFantasyFuelPlayer | undefined,
    fantasyDataPlayer: FantasyDataPlayer | undefined,
    dailyFantasyNerdPlayer: DailyFantasyNerdPlayer | undefined
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
    if (fantasyDataPlayer !== undefined) {
      count++;
      totalProjection += fantasyDataPlayer.projectedPoints;
    }
    if (dailyFantasyNerdPlayer !== undefined) {
      count++;
      totalProjection += dailyFantasyNerdPlayer.projectedPoints;
    }
    return count !== 0 ? totalProjection / count : 0;
  }

  projectPlayers(
    draftKingsAvailablePlayers: DraftKingsAvailablePlayer[],
    rotoGrindersPlayers: RotoGrindersPlayer[],
    numberFirePlayers: NumberFirePlayer[],
    dailyFantasyFuelPlayers: DailyFantasyFuelPlayer[],
    fantasyDataPlayers: FantasyDataPlayer[],
    dailyFantasyNerdPlayers: DailyFantasyNerdPlayer[]
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
        const linkedFantasyDataPlayer:
          | FantasyDataPlayer
          | undefined = fantasyDataPlayers.find((player: FantasyDataPlayer) => {
          return (
            player.fullName === draftKingsAvailablePlayer.fullName &&
            player.position === draftKingsAvailablePlayer.position
          );
        });
        const linkedDailyFantasyNerdPlayer:
          | DailyFantasyNerdPlayer
          | undefined = dailyFantasyNerdPlayers.find(
          (player: DailyFantasyNerdPlayer) => {
            return (
              player.fullName === draftKingsAvailablePlayer.fullName &&
              player.position === draftKingsAvailablePlayer.position
            );
          }
        );
        const averageProjectedPoints: number = this.projectPointTotal(
          linkedRotoGrindersPlayer,
          linkedNumberFirePlayer,
          linkedDailyFantasyFuelPlayer,
          linkedFantasyDataPlayer,
          linkedDailyFantasyNerdPlayer
        );
        const lastName:
          | string
          | undefined = draftKingsAvailablePlayer.fullName.split(' ')[1];
        const projectedPlayer: ProjectedPlayer = {
          firstName: draftKingsAvailablePlayer.fullName.split(' ')[0],
          // handle undefined last names (defenses)
          lastName: lastName ? lastName : '',
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
          fantasyDataProjection:
            linkedFantasyDataPlayer !== undefined
              ? linkedFantasyDataPlayer.projectedPoints
              : 0,
          dailyFantasyNerdProjection:
            linkedDailyFantasyNerdPlayer !== undefined
              ? linkedDailyFantasyNerdPlayer.projectedPoints
              : 0,
          projectedPoints: +averageProjectedPoints.toFixed(2),
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
