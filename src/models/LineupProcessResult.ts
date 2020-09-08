import { DraftKingsLineup } from './DraftKingsLineup';

export interface LineupProcessResult {
  topLineups: DraftKingsLineup[];
  minIndex: number;
}
