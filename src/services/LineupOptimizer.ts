import {
  DraftKingsLineup,
  MaxSalariesAtPosition,
  ProjectedPlayer,
  LineupProcessResult,
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

  lineupCombinationDoesNotExist(
    lineup: DraftKingsLineup,
    topLineups: DraftKingsLineup[]
  ): boolean {
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
    const duplicateLineup: DraftKingsLineup | undefined = topLineups.find(
      (topLineup: DraftKingsLineup) => {
        const topLineupPlayerIds: string[] = [
          topLineup.QB,
          topLineup.RB1,
          topLineup.RB2,
          topLineup.WR1,
          topLineup.WR2,
          topLineup.WR3,
          topLineup.TE,
          topLineup.FLEX,
          topLineup.DST,
        ].sort();
        const idsAreEqual: boolean =
          JSON.stringify(lineupPlayerIds) ===
          JSON.stringify(topLineupPlayerIds);
        return idsAreEqual;
      }
    );
    return duplicateLineup === undefined;
  }

  processLineup(
    lineup: DraftKingsLineup,
    topLineups: DraftKingsLineup[],
    numLineups: number,
    minIndex: number
  ): LineupProcessResult {
    let newLineups: DraftKingsLineup[] = [...topLineups];
    let newMinIndex: number = minIndex;
    if (newLineups.length < numLineups) {
      // push lineup into array immediately and find min index
      newLineups.push(lineup);
      newMinIndex = this.findMinIndex(newLineups);
    } else {
      if (
        newLineups[minIndex].projectedPoints < lineup.projectedPoints &&
        this.lineupCombinationDoesNotExist(lineup, topLineups)
      ) {
        // swap min lineup for new lineup and find min index
        newLineups[minIndex] = lineup;
        newMinIndex = this.findMinIndex(newLineups);
      }
    }
    const lineupProcessResult: LineupProcessResult = {
      topLineups: newLineups,
      minIndex: newMinIndex,
    };
    return lineupProcessResult;
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
    let minIndex: number = 0;
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
    quarterbacks.forEach((quarterback: ProjectedPlayer, index: number) => {
      console.log(
        `Processing QB${index} ${quarterback.firstName} ${quarterback.lastName}`
      );
      let lineupSalaryTotal: number = this.calculateSalaryTotal([quarterback]);
      if (lineupSalaryTotal <= maxSalariesAtPosition.QB) {
        runningbacks.forEach(
          (runningback1: ProjectedPlayer, rb1Index: number) => {
            lineupSalaryTotal = this.calculateSalaryTotal([
              quarterback,
              runningback1,
            ]);
            if (lineupSalaryTotal <= maxSalariesAtPosition.RB1) {
              runningbacks.forEach(
                (runningback2: ProjectedPlayer, rb2Index: number) => {
                  lineupSalaryTotal = this.calculateSalaryTotal([
                    quarterback,
                    runningback1,
                    runningback2,
                  ]);
                  if (
                    lineupSalaryTotal <= maxSalariesAtPosition.RB2 &&
                    rb1Index < rb2Index
                  ) {
                    wideReceivers.forEach(
                      (wideReceiver1: ProjectedPlayer, wr1Index: number) => {
                        lineupSalaryTotal = this.calculateSalaryTotal([
                          quarterback,
                          runningback1,
                          runningback2,
                          wideReceiver1,
                        ]);
                        if (lineupSalaryTotal <= maxSalariesAtPosition.WR1) {
                          wideReceivers.forEach(
                            (
                              wideReceiver2: ProjectedPlayer,
                              wr2Index: number
                            ) => {
                              lineupSalaryTotal = this.calculateSalaryTotal([
                                quarterback,
                                runningback1,
                                runningback2,
                                wideReceiver1,
                                wideReceiver2,
                              ]);
                              if (
                                lineupSalaryTotal <=
                                  maxSalariesAtPosition.WR2 &&
                                wr1Index < wr2Index
                              ) {
                                wideReceivers.forEach(
                                  (
                                    wideReceiver3: ProjectedPlayer,
                                    wr3Index: number
                                  ) => {
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
                                    if (
                                      lineupSalaryTotal <=
                                        maxSalariesAtPosition.WR3 &&
                                      !this.hasDuplicatePlayerIds([
                                        wideReceiver1,
                                        wideReceiver2,
                                        wideReceiver3,
                                      ]) &&
                                      wr1Index < wr3Index &&
                                      wr2Index < wr3Index
                                    ) {
                                      tightEnds.forEach(
                                        (tightEnd: ProjectedPlayer) => {
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
                                          if (
                                            lineupSalaryTotal <=
                                            maxSalariesAtPosition.TE
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
                                                    (
                                                      defense: ProjectedPlayer
                                                    ) => {
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
                                                      if (
                                                        lineupSalaryTotal <=
                                                        50000
                                                      ) {
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
                                                          QB:
                                                            quarterback.playerId,
                                                          RB1:
                                                            runningback1.playerId,
                                                          RB2:
                                                            runningback2.playerId,
                                                          WR1:
                                                            wideReceiver1.playerId,
                                                          WR2:
                                                            wideReceiver2.playerId,
                                                          WR3:
                                                            wideReceiver3.playerId,
                                                          TE: tightEnd.playerId,
                                                          FLEX:
                                                            flexOption.playerId,
                                                          DST: defense.playerId,
                                                          projectedPoints: projectedPoints,
                                                          totalSalary: lineupSalaryTotal,
                                                        };
                                                        let lineupProcessResult = this.processLineup(
                                                          draftKingsLineup,
                                                          topLineups,
                                                          numLineups,
                                                          minIndex
                                                        );
                                                        minIndex =
                                                          lineupProcessResult.minIndex;
                                                        topLineups =
                                                          lineupProcessResult.topLineups;
                                                      }
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
                                        ]
                                      );
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
                            }
                          );
                        } else {
                          lineupSalaryTotal = this.calculateSalaryTotal([
                            quarterback,
                            runningback1,
                            runningback2,
                          ]);
                        }
                      }
                    );
                  } else {
                    lineupSalaryTotal = this.calculateSalaryTotal([
                      quarterback,
                      runningback1,
                    ]);
                  }
                }
              );
            } else {
              lineupSalaryTotal = this.calculateSalaryTotal([quarterback]);
            }
          }
        );
      } else {
        lineupSalaryTotal = 0;
      }
    });
    return topLineups;
  }
}
