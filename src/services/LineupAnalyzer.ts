import { DraftKingsLineup, LineupStatistics, ProjectedPlayer } from '../models';

export class LineupAnalyzer {
  printLineupStatistics(
    playerProjections: ProjectedPlayer[],
    topLineups: DraftKingsLineup[]
  ): void {
    const minProjection: number = this.findMinProjection(topLineups);
    const maxProjection: number = this.findMaxProjection(topLineups);
    const totalLineups: number = topLineups.length;
    const lineupStatistics: LineupStatistics = this.generateLineupStatistics(
      playerProjections,
      topLineups
    );
    console.log(`Generated ${totalLineups} lineups`);
    console.log(`Min Projection - ${minProjection}`);
    console.log(`Max Projection - ${maxProjection}`);
    console.log('Printing Player Appearances...');
    console.log('------------------QB------------------');
    this.printPositionalLineupAppearances(
      playerProjections,
      lineupStatistics.QB
    );
    console.log('------------------RB------------------');
    this.printPositionalLineupAppearances(
      playerProjections,
      lineupStatistics.RB
    );
    console.log('------------------WR------------------');
    this.printPositionalLineupAppearances(
      playerProjections,
      lineupStatistics.WR
    );
    console.log('------------------TE------------------');
    this.printPositionalLineupAppearances(
      playerProjections,
      lineupStatistics.TE
    );
    console.log('------------------DST------------------');
    this.printPositionalLineupAppearances(
      playerProjections,
      lineupStatistics.DST
    );
  }

  findMinProjection(topLineups: DraftKingsLineup[]): number {
    let minProjection: number = topLineups[0].projectedPoints;
    topLineups.forEach((lineup: DraftKingsLineup) => {
      if (lineup.projectedPoints < minProjection) {
        minProjection = lineup.projectedPoints;
      }
    });
    return minProjection;
  }

  findMaxProjection(topLineups: DraftKingsLineup[]): number {
    let maxProjection: number = topLineups[0].projectedPoints;
    topLineups.forEach((lineup: DraftKingsLineup) => {
      if (lineup.projectedPoints > maxProjection) {
        maxProjection = lineup.projectedPoints;
      }
    });
    return maxProjection;
  }

  generateLineupStatistics(
    playerProjections: ProjectedPlayer[],
    topLineups: DraftKingsLineup[]
  ): LineupStatistics {
    let quarterbackIds: Map<string, number> = new Map<string, number>();
    let runningbackIds: Map<string, number> = new Map<string, number>();
    let wideReceiverIds: Map<string, number> = new Map<string, number>();
    let tightEndIds: Map<string, number> = new Map<string, number>();
    let defenseIds: Map<string, number> = new Map<string, number>();
    playerProjections.forEach((player: ProjectedPlayer) => {
      const appearances: DraftKingsLineup[] = topLineups.filter(
        (lineup: DraftKingsLineup) => {
          const allIds: string[] = [
            lineup.QB,
            lineup.RB1,
            lineup.RB2,
            lineup.WR1,
            lineup.WR2,
            lineup.WR3,
            lineup.TE,
            lineup.FLEX,
            lineup.DST,
          ];
          return allIds.includes(player.playerId);
        }
      );
      switch (player.position) {
        case 'QB':
          quarterbackIds.set(player.playerId, appearances.length);
          break;
        case 'RB':
          runningbackIds.set(player.playerId, appearances.length);
          break;
        case 'WR':
          wideReceiverIds.set(player.playerId, appearances.length);
          break;
        case 'TE':
          tightEndIds.set(player.playerId, appearances.length);
          break;
        case 'DST':
          defenseIds.set(player.playerId, appearances.length);
          break;
        default:
          break;
      }
    });
    const lineupStatistics: LineupStatistics = {
      QB: quarterbackIds,
      RB: runningbackIds,
      WR: wideReceiverIds,
      TE: tightEndIds,
      DST: defenseIds,
    };
    return lineupStatistics;
  }

  printPositionalLineupAppearances(
    playerProjections: ProjectedPlayer[],
    positionalAppearances: Map<string, number>
  ): void {
    positionalAppearances.forEach((appearances: number, playerId: string) => {
      const playerProjection: ProjectedPlayer = playerProjections.find(
        (player: ProjectedPlayer) => {
          return player.playerId === playerId;
        }
      )!;
      console.log(
        `${playerProjection.firstName} ${playerProjection.lastName} - ${appearances}`
      );
    });
  }
}
