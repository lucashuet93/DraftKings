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
    topLineups.forEach((lineup: DraftKingsLineup) => {
      const flexPosition: string = playerProjections.find(
        (player: ProjectedPlayer) => {
          return player.playerId === lineup.FLEX;
        }
      )!.position;
      if (quarterbackIds.has(lineup.QB)) {
        const currentCount: number = quarterbackIds.get(lineup.QB)!;
        quarterbackIds.set(lineup.QB, currentCount + 1);
      } else {
        quarterbackIds.set(lineup.QB, 1);
      }
      if (runningbackIds.has(lineup.RB1)) {
        const currentCount: number = runningbackIds.get(lineup.RB1)!;
        runningbackIds.set(lineup.RB1, currentCount + 1);
      } else {
        runningbackIds.set(lineup.RB1, 1);
      }
      if (runningbackIds.has(lineup.RB2)) {
        const currentCount: number = runningbackIds.get(lineup.RB2)!;
        runningbackIds.set(lineup.RB2, currentCount + 1);
      } else {
        runningbackIds.set(lineup.RB2, 1);
      }
      if (runningbackIds.has(lineup.FLEX)) {
        const currentCount: number = runningbackIds.get(lineup.FLEX)!;
        runningbackIds.set(lineup.FLEX, currentCount + 1);
      } else {
        // if flex is a running back, add it
        if (flexPosition === 'RB') {
          runningbackIds.set(lineup.FLEX, 1);
        }
      }
      if (wideReceiverIds.has(lineup.WR1)) {
        const currentCount: number = wideReceiverIds.get(lineup.WR1)!;
        wideReceiverIds.set(lineup.WR1, currentCount + 1);
      } else {
        wideReceiverIds.set(lineup.WR1, 1);
      }
      if (wideReceiverIds.has(lineup.WR2)) {
        const currentCount: number = wideReceiverIds.get(lineup.WR2)!;
        wideReceiverIds.set(lineup.WR2, currentCount + 1);
      } else {
        wideReceiverIds.set(lineup.WR2, 1);
      }
      if (wideReceiverIds.has(lineup.WR3)) {
        const currentCount: number = wideReceiverIds.get(lineup.WR3)!;
        wideReceiverIds.set(lineup.WR3, currentCount + 1);
      } else {
        wideReceiverIds.set(lineup.WR3, 1);
      }
      if (wideReceiverIds.has(lineup.FLEX)) {
        const currentCount: number = wideReceiverIds.get(lineup.FLEX)!;
        wideReceiverIds.set(lineup.FLEX, currentCount + 1);
      } else {
        // if flex is a wide receiver, add it
        if (flexPosition === 'WR') {
          wideReceiverIds.set(lineup.FLEX, 1);
        }
      }
      if (tightEndIds.has(lineup.TE)) {
        const currentCount: number = tightEndIds.get(lineup.TE)!;
        tightEndIds.set(lineup.TE, currentCount + 1);
      } else {
        tightEndIds.set(lineup.TE, 1);
      }
      if (tightEndIds.has(lineup.FLEX)) {
        const currentCount: number = tightEndIds.get(lineup.FLEX)!;
        tightEndIds.set(lineup.FLEX, currentCount + 1);
      } else {
        // if flex is a tight end, add it
        if (flexPosition === 'TE') {
          tightEndIds.set(lineup.FLEX, 1);
        }
      }
      if (defenseIds.has(lineup.DST)) {
        const currentCount: number = defenseIds.get(lineup.DST)!;
        defenseIds.set(lineup.DST, currentCount + 1);
      } else {
        defenseIds.set(lineup.DST, 1);
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
