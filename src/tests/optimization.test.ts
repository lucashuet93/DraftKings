import { describe } from 'mocha';
import { expect } from 'chai';
import { LineupOptimizer, SalaryAnalyzer } from '../services';
import { ProjectedPlayer, DraftKingsLineup } from '../models';

describe('lineupOptimizer', function () {
  it('optimize', function () {
    this.timeout(60000);
    const salaryAnalyzer: SalaryAnalyzer = new SalaryAnalyzer();
    const lineupOptimizer: LineupOptimizer = new LineupOptimizer(
      salaryAnalyzer
    );
    const playerProjections: ProjectedPlayer[] = [
      {
        firstName: 'Player',
        lastName: '1',
        playerId: '1',
        position: 'QB',
        salary: 8000,
        projectedPoints: 20,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '2',
        playerId: '2',
        position: 'QB',
        salary: 7500,
        projectedPoints: 19.2,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '3',
        playerId: '3',
        position: 'QB',
        salary: 6000,
        projectedPoints: 17.4,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '4',
        playerId: '4',
        position: 'RB',
        salary: 8800,
        projectedPoints: 23.4,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '5',
        playerId: '5',
        position: 'RB',
        salary: 7200,
        projectedPoints: 19.5,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '6',
        playerId: '6',
        position: 'RB',
        salary: 5000,
        projectedPoints: 12.5,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '7',
        playerId: '7',
        position: 'RB',
        salary: 4500,
        projectedPoints: 10.9,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '8',
        playerId: '8',
        position: 'WR',
        salary: 7500,
        projectedPoints: 20.3,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '9',
        playerId: '9',
        position: 'WR',
        salary: 6600,
        projectedPoints: 15,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '12',
        playerId: '12',
        position: 'WR',
        salary: 5100,
        projectedPoints: 13.9,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '10',
        playerId: '10',
        position: 'WR',
        salary: 4200,
        projectedPoints: 11,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '11',
        playerId: '11',
        position: 'WR',
        salary: 3800,
        projectedPoints: 10.3,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '13',
        playerId: '13',
        position: 'TE',
        salary: 5500,
        projectedPoints: 14,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '14',
        playerId: '14',
        position: 'TE',
        salary: 3900,
        projectedPoints: 10.8,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '15',
        playerId: '15',
        position: 'TE',
        salary: 3400,
        projectedPoints: 9.1,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '16',
        playerId: '16',
        position: 'DST',
        salary: 3000,
        projectedPoints: 9.2,
      } as ProjectedPlayer,
      {
        firstName: 'Player',
        lastName: '16',
        playerId: '16',
        position: 'DST',
        salary: 2400,
        projectedPoints: 7.3,
      } as ProjectedPlayer,
    ];
    const expectedLineups: number = 10;
    const optimizedLineups: DraftKingsLineup[] = lineupOptimizer.optimizeLineups(
      playerProjections,
      expectedLineups
    );
    const allLineupPermutations: DraftKingsLineup[] = generateAllLineupPermutations(
      playerProjections
    );
    const permutationsUnderSalary: DraftKingsLineup[] = removeLineupsExceedingMaxSalary(
      allLineupPermutations
    );
    const lineupsWithoutDuplicatePlayers: DraftKingsLineup[] = removeLineupsWithDuplicatePlayers(
      permutationsUnderSalary
    );
    const uniquePermutations: DraftKingsLineup[] = removeDuplicateLineups(
      lineupsWithoutDuplicatePlayers
    );
    const sortedTopLineups: DraftKingsLineup[] = sortLineupsByProjectedScore(
      uniquePermutations
    ).slice(0, expectedLineups);
    const sortedOptimizedLineups: DraftKingsLineup[] = sortLineupsByProjectedScore(
      optimizedLineups
    );
    let arraysAreEqual: boolean = true;
    sortedOptimizedLineups.forEach((optimizedLineup: DraftKingsLineup) => {
      const foundLineup: DraftKingsLineup | undefined = sortedTopLineups.find(
        (topLineup: DraftKingsLineup) => {
          return (
            optimizedLineup.QB === topLineup.QB &&
            optimizedLineup.RB1 === topLineup.RB1 &&
            optimizedLineup.RB2 === topLineup.RB2 &&
            optimizedLineup.WR1 === topLineup.WR1 &&
            optimizedLineup.WR2 === topLineup.WR2 &&
            optimizedLineup.WR3 === topLineup.WR3 &&
            optimizedLineup.TE === topLineup.TE &&
            optimizedLineup.FLEX === topLineup.FLEX &&
            optimizedLineup.DST === topLineup.DST
          );
        }
      );
      if (foundLineup === undefined) {
        arraysAreEqual = false;
      }
    });
    expect(optimizedLineups.length).equal(expectedLineups);
    expect(arraysAreEqual).to.be.true;
  });
});

const removeLineupsExceedingMaxSalary = (
  lineups: DraftKingsLineup[]
): DraftKingsLineup[] => {
  return lineups.filter((lineup: DraftKingsLineup) => {
    return lineup.totalSalary <= 50000;
  });
};

const removeLineupsWithDuplicatePlayers = (
  lineups: DraftKingsLineup[]
): DraftKingsLineup[] => {
  return lineups.filter((lineup: DraftKingsLineup) => {
    const lineupPlayerIds: string[] = [
      lineup.QB,
      lineup.RB1,
      lineup.RB2,
      lineup.WR1,
      lineup.WR2,
      lineup.WR3,
      lineup.TE,
      lineup.FLEX,
      lineup.DST,
    ].sort();
    return lineupPlayerIds.length === new Set(lineupPlayerIds).size;
  });
};

const removeDuplicateLineups = (
  lineups: DraftKingsLineup[]
): DraftKingsLineup[] => {
  let uniqueLineups: DraftKingsLineup[] = [];
  lineups.forEach((lineup: DraftKingsLineup) => {
    const lineupPlayerIds: string[] = [
      lineup.QB,
      lineup.RB1,
      lineup.RB2,
      lineup.WR1,
      lineup.WR2,
      lineup.WR3,
      lineup.TE,
      lineup.FLEX,
      lineup.DST,
    ].sort();
    const duplicateLineup: DraftKingsLineup | undefined = uniqueLineups.find(
      (uniqueLineup: DraftKingsLineup) => {
        const uniqueLineupPlayerIds: string[] = [
          uniqueLineup.QB,
          uniqueLineup.RB1,
          uniqueLineup.RB2,
          uniqueLineup.WR1,
          uniqueLineup.WR2,
          uniqueLineup.WR3,
          uniqueLineup.TE,
          uniqueLineup.FLEX,
          uniqueLineup.DST,
        ].sort();
        const idsAreEqual: boolean =
          JSON.stringify(lineupPlayerIds) ===
          JSON.stringify(uniqueLineupPlayerIds);
        return idsAreEqual;
      }
    );
    if (!duplicateLineup) {
      uniqueLineups.push(lineup);
    }
  });
  return uniqueLineups;
};

const sortLineupsByProjectedScore = (
  lineups: DraftKingsLineup[]
): DraftKingsLineup[] => {
  return lineups.sort((a: DraftKingsLineup, b: DraftKingsLineup) => {
    if (a.projectedPoints < b.projectedPoints) {
      return 1;
    }
    if (a.projectedPoints > b.projectedPoints) {
      return -1;
    }
    return 0;
  });
};

const generateAllLineupPermutations = (
  playerProjections: ProjectedPlayer[]
): DraftKingsLineup[] => {
  let allLineups: DraftKingsLineup[] = [];
  const quarterbacks: ProjectedPlayer[] = playerProjections.filter(
    (player: ProjectedPlayer) => player.position === 'QB'
  );
  const runningbacks: ProjectedPlayer[] = playerProjections.filter(
    (player: ProjectedPlayer) => player.position === 'RB'
  );
  const wideReceivers: ProjectedPlayer[] = playerProjections.filter(
    (player: ProjectedPlayer) => player.position === 'WR'
  );
  const tightEnds: ProjectedPlayer[] = playerProjections.filter(
    (player: ProjectedPlayer) => player.position === 'TE'
  );
  const flexOptions: ProjectedPlayer[] = playerProjections.filter(
    (player: ProjectedPlayer) =>
      player.position === 'RB' ||
      player.position === 'WR' ||
      player.position === 'TE'
  );
  const defenses: ProjectedPlayer[] = playerProjections.filter(
    (player: ProjectedPlayer) => player.position === 'DST'
  );
  quarterbacks.forEach((quarterback: ProjectedPlayer) => {
    runningbacks.forEach((runningback1: ProjectedPlayer) => {
      runningbacks.forEach((runningback2: ProjectedPlayer) => {
        wideReceivers.forEach((wideReceiver1: ProjectedPlayer) => {
          wideReceivers.forEach((wideReceiver2: ProjectedPlayer) => {
            wideReceivers.forEach((wideReceiver3: ProjectedPlayer) => {
              tightEnds.forEach((tightEnd: ProjectedPlayer) => {
                flexOptions.forEach((flexOption: ProjectedPlayer) => {
                  defenses.forEach((defense: ProjectedPlayer) => {
                    const projectedPoints: number =
                      quarterback.projectedPoints +
                      runningback1.projectedPoints +
                      runningback2.projectedPoints +
                      wideReceiver1.projectedPoints +
                      wideReceiver2.projectedPoints +
                      wideReceiver3.projectedPoints +
                      tightEnd.projectedPoints +
                      flexOption.projectedPoints +
                      defense.projectedPoints;
                    const totalSalary: number =
                      quarterback.salary +
                      runningback1.salary +
                      runningback2.salary +
                      wideReceiver1.salary +
                      wideReceiver2.salary +
                      wideReceiver3.salary +
                      tightEnd.salary +
                      flexOption.salary +
                      defense.salary;
                    const draftKingsLineup: DraftKingsLineup = {
                      QB: quarterback.playerId,
                      RB1: runningback1.playerId,
                      RB2: runningback2.playerId,
                      WR1: wideReceiver1.playerId,
                      WR2: wideReceiver2.playerId,
                      WR3: wideReceiver3.playerId,
                      TE: tightEnd.playerId,
                      FLEX: flexOption.playerId,
                      DST: defense.playerId,
                      projectedPoints: projectedPoints,
                      totalSalary: totalSalary,
                    };
                    allLineups.push(draftKingsLineup);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  return allLineups;
};
