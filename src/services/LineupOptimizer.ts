import {
  DraftKingsLineup,
  MaxSalariesAtPosition,
  ProjectedPlayer,
} from '../models';
import { SalaryAnalyzer } from './SalaryAnalyzer';

export class LineupOptimizer {
  constructor(public salaryAnalyzer: SalaryAnalyzer) {}

  calculateSalaryTotal(playerProjections: ProjectedPlayer[]): number {
    return playerProjections.reduce(
      (total: number, player: ProjectedPlayer) => {
        return total + player.salary;
      },
      0
    );
  }

  hasDuplicatePlayerIds(playerProjections: ProjectedPlayer[]): boolean {
    const playerIds: string[] = playerProjections.map(
      (player: ProjectedPlayer) => {
        return player.playerId;
      }
    );
    const hasDuplicates: boolean = new Set(playerIds).size !== playerIds.length;
    return hasDuplicates;
  }

  logPlayer(player: ProjectedPlayer, index: string = ''): void {
    console.log(
      `Processing ${player.position}${index} ${player.firstName.concat(
        player.lastName
      )}`
    );
  }

  processLineup(
    lineup: DraftKingsLineup,
    topLineups: DraftKingsLineup[],
    numLineups: number
  ): DraftKingsLineup[] {
    let newLineups: DraftKingsLineup[] = [...topLineups];
    if (newLineups.length < numLineups) {
      newLineups.push(lineup);
    } else {
      const minIndex: number = this.findMinIndex(newLineups);
      if (newLineups[minIndex].projectedPoints < lineup.projectedPoints) {
        newLineups[minIndex] = lineup;
      }
    }
    return newLineups;
  }

  findMinIndex(topLineups: DraftKingsLineup[]): number {
    let minIndex: number = 0;
    let minProjectedPoints = topLineups[0].projectedPoints;
    topLineups.forEach((lineup: DraftKingsLineup, index: number) => {
      if (lineup.projectedPoints < minProjectedPoints) {
        minProjectedPoints = lineup.projectedPoints;
        minIndex = index;
      }
    });
    return minIndex;
  }

  optimizeLineups(
    playerProjections: ProjectedPlayer[],
    numLineups: number
  ): DraftKingsLineup[] {
    let topLineups: DraftKingsLineup[] = [];
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
    const maxSalariesAtPosition: MaxSalariesAtPosition = this.salaryAnalyzer.findMaxSalariesAtPositions(
      runningbacks,
      wideReceivers,
      tightEnds,
      flexOptions,
      defenses
    );
    quarterbacks.forEach((quarterback: ProjectedPlayer) => {
      this.logPlayer(quarterback);
      let lineupSalaryTotal: number = this.calculateSalaryTotal([quarterback]);
      if (lineupSalaryTotal <= maxSalariesAtPosition.QB) {
        runningbacks.forEach((runningback1: ProjectedPlayer) => {
          this.logPlayer(runningback1), '1';
          lineupSalaryTotal = this.calculateSalaryTotal([
            quarterback,
            runningback1,
          ]);
          if (lineupSalaryTotal <= maxSalariesAtPosition.RB1) {
            runningbacks.forEach((runningback2: ProjectedPlayer) => {
              this.logPlayer(runningback2, '2');
              lineupSalaryTotal = this.calculateSalaryTotal([
                quarterback,
                runningback1,
                runningback2,
              ]);
              if (
                lineupSalaryTotal <= maxSalariesAtPosition.RB2 &&
                !this.hasDuplicatePlayerIds([runningback1, runningback2])
              ) {
                wideReceivers.forEach((wideReceiver1: ProjectedPlayer) => {
                  this.logPlayer(wideReceiver1, '1');
                  lineupSalaryTotal = this.calculateSalaryTotal([
                    quarterback,
                    runningback1,
                    runningback2,
                    wideReceiver1,
                  ]);
                  if (lineupSalaryTotal <= maxSalariesAtPosition.WR1) {
                    wideReceivers.forEach((wideReceiver2: ProjectedPlayer) => {
                      this.logPlayer(wideReceiver2, '2');
                      lineupSalaryTotal = this.calculateSalaryTotal([
                        quarterback,
                        runningback1,
                        runningback2,
                        wideReceiver1,
                        wideReceiver2,
                      ]);
                      if (
                        lineupSalaryTotal <= maxSalariesAtPosition.WR2 &&
                        !this.hasDuplicatePlayerIds([
                          wideReceiver1,
                          wideReceiver2,
                        ])
                      ) {
                        wideReceivers.forEach(
                          (wideReceiver3: ProjectedPlayer) => {
                            lineupSalaryTotal = this.calculateSalaryTotal([
                              quarterback,
                              runningback1,
                              runningback2,
                              wideReceiver1,
                              wideReceiver2,
                              wideReceiver3,
                            ]);
                            if (
                              lineupSalaryTotal <= maxSalariesAtPosition.WR3 &&
                              !this.hasDuplicatePlayerIds([
                                wideReceiver1,
                                wideReceiver2,
                                wideReceiver3,
                              ])
                            ) {
                              tightEnds.forEach((tightEnd: ProjectedPlayer) => {
                                lineupSalaryTotal = this.calculateSalaryTotal([
                                  quarterback,
                                  runningback1,
                                  runningback2,
                                  wideReceiver1,
                                  wideReceiver2,
                                  wideReceiver3,
                                  tightEnd,
                                ]);
                                if (
                                  lineupSalaryTotal <= maxSalariesAtPosition.TE
                                ) {
                                  flexOptions.forEach(
                                    (flexOption: ProjectedPlayer) => {
                                      lineupSalaryTotal = this.calculateSalaryTotal(
                                        [
                                          quarterback,
                                          runningback1,
                                          runningback2,
                                          wideReceiver1,
                                          wideReceiver2,
                                          wideReceiver3,
                                          tightEnd,
                                          flexOption,
                                        ]
                                      );
                                      if (
                                        lineupSalaryTotal <=
                                          maxSalariesAtPosition.FLEX &&
                                        !this.hasDuplicatePlayerIds([
                                          runningback1,
                                          runningback2,
                                          wideReceiver1,
                                          wideReceiver2,
                                          wideReceiver3,
                                          tightEnd,
                                          flexOption,
                                        ])
                                      ) {
                                        defenses.forEach(
                                          (defense: ProjectedPlayer) => {
                                            lineupSalaryTotal = this.calculateSalaryTotal(
                                              [
                                                quarterback,
                                                runningback1,
                                                runningback2,
                                                wideReceiver1,
                                                wideReceiver2,
                                                wideReceiver3,
                                                tightEnd,
                                                flexOption,
                                                defense,
                                              ]
                                            );
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
                                              totalSalary: lineupSalaryTotal,
                                            };
                                            topLineups = this.processLineup(
                                              draftKingsLineup,
                                              topLineups,
                                              numLineups
                                            );
                                            lineupSalaryTotal = this.calculateSalaryTotal(
                                              [
                                                quarterback,
                                                runningback1,
                                                runningback2,
                                                wideReceiver1,
                                                wideReceiver2,
                                                wideReceiver3,
                                                tightEnd,
                                                flexOption,
                                              ]
                                            );
                                          }
                                        );
                                      } else {
                                        lineupSalaryTotal = this.calculateSalaryTotal(
                                          [
                                            quarterback,
                                            runningback1,
                                            runningback2,
                                            wideReceiver1,
                                            wideReceiver2,
                                            wideReceiver3,
                                            tightEnd,
                                          ]
                                        );
                                      }
                                    }
                                  );
                                } else {
                                  lineupSalaryTotal = this.calculateSalaryTotal(
                                    [
                                      quarterback,
                                      runningback1,
                                      runningback2,
                                      wideReceiver1,
                                      wideReceiver2,
                                      wideReceiver3,
                                    ]
                                  );
                                }
                              });
                            } else {
                              lineupSalaryTotal = this.calculateSalaryTotal([
                                quarterback,
                                runningback1,
                                runningback2,
                                wideReceiver1,
                                wideReceiver2,
                              ]);
                            }
                          }
                        );
                      } else {
                        lineupSalaryTotal = this.calculateSalaryTotal([
                          quarterback,
                          runningback1,
                          runningback2,
                          wideReceiver1,
                        ]);
                      }
                    });
                  } else {
                    lineupSalaryTotal = this.calculateSalaryTotal([
                      quarterback,
                      runningback1,
                      runningback2,
                    ]);
                  }
                });
              } else {
                lineupSalaryTotal = this.calculateSalaryTotal([
                  quarterback,
                  runningback1,
                ]);
              }
            });
          } else {
            lineupSalaryTotal = this.calculateSalaryTotal([quarterback]);
          }
        });
      } else {
        lineupSalaryTotal = 0;
      }
    });
    return topLineups;
  }
}
