export interface RotoGrindersPlayer {
  playerId: string;
  team: string;
  opponent: string;
  position: string;
  fullName: string;
  projectedPoints: number;
  projectedOwnership: number;
  ceiling: number;
  floor: number;
  minExposure: number;
  maxExposure: number;
}
