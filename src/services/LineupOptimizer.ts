import {
  DraftKingsLineup,
  MaxSalariesAtPosition,
  ProjectedPlayer,
} from '../models';
import { SalaryAnalyzer } from './SalaryAnalyzer';

export class LineupOptimizer {
  constructor(public salaryAnalyzer: SalaryAnalyzer) {}
  optimizeLineups(playerProjections: ProjectedPlayer[]): DraftKingsLineup[] {
    let lineups: DraftKingsLineup[] = [];
    const quarterBacks: ProjectedPlayer[] = playerProjections.filter(
      (player: ProjectedPlayer) => player.position === 'QB'
    );
    const runningBacks: ProjectedPlayer[] = playerProjections.filter(
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
      runningBacks,
      wideReceivers,
      tightEnds,
      flexOptions,
      defenses
    );
    return lineups;
  }
}
