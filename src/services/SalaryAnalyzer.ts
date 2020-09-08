import { MaxSalariesAtPosition, ProjectedPlayer } from '../models';

export class SalaryAnalyzer {
  findMinSalaryAtPosition(playerProjections: ProjectedPlayer[]): number {
    let minSalary: number = playerProjections[0].salary;
    playerProjections.forEach((player: ProjectedPlayer) => {
      if (player.salary < minSalary) {
        minSalary = player.salary;
      }
    });
    return minSalary;
  }

  findMaxSalariesAtPositions(
    runningBacks: ProjectedPlayer[],
    wideReceivers: ProjectedPlayer[],
    tightEnds: ProjectedPlayer[],
    flexOptions: ProjectedPlayer[],
    defenses: ProjectedPlayer[]
  ): MaxSalariesAtPosition {
    const maxSalary: number = 50000;
    const minRBSalary: number = this.findMinSalaryAtPosition(runningBacks);
    const minWRSalary: number = this.findMinSalaryAtPosition(wideReceivers);
    const minTESalary: number = this.findMinSalaryAtPosition(tightEnds);
    const minFlexSalary: number = this.findMinSalaryAtPosition(flexOptions);
    const minDefenseSalary: number = this.findMinSalaryAtPosition(defenses);
    const maxSalaryAfterQB: number =
      maxSalary -
      minRBSalary * 2 -
      minWRSalary * 3 -
      minTESalary -
      minFlexSalary -
      minDefenseSalary;
    const maxSalaryAfterRB1: number =
      maxSalary -
      minRBSalary -
      minWRSalary * 3 -
      minTESalary -
      minFlexSalary -
      minDefenseSalary;
    const maxSalaryAfterRB2: number =
      maxSalary -
      minWRSalary * 3 -
      minTESalary -
      minFlexSalary -
      minDefenseSalary;
    const maxSalaryAfterWR1: number =
      maxSalary -
      minWRSalary * 2 -
      minTESalary -
      minFlexSalary -
      minDefenseSalary;
    const maxSalaryAfterWR2: number =
      maxSalary -
      minWRSalary * 1 -
      minTESalary -
      minFlexSalary -
      minDefenseSalary;
    const maxSalaryAfterWR3: number =
      maxSalary - minTESalary - minFlexSalary - minDefenseSalary;
    const maxSalaryAfterTE: number =
      maxSalary - minFlexSalary - minDefenseSalary;
    const maxSalaryAfterFlex: number = maxSalary - minDefenseSalary;
    const maxSalariesAtPosition: MaxSalariesAtPosition = {
      QB: maxSalaryAfterQB,
      RB1: maxSalaryAfterRB1,
      RB2: maxSalaryAfterRB2,
      WR1: maxSalaryAfterWR1,
      WR2: maxSalaryAfterWR2,
      WR3: maxSalaryAfterWR3,
      TE: maxSalaryAfterTE,
      FLEX: maxSalaryAfterFlex,
    };
    return maxSalariesAtPosition;
  }
}
