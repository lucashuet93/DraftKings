export interface DailyFantasyNerdPlayer {
  fullName: string;
  likes: number;
  injuryStatus: string;
  position: string;
  salary: number;
  team: string;
  opponent: string;
  vegasPoints: number;
  vegasSpread: string;
  defensePassingYdsPerGame: string;
  defenseRushingYdsPerGame: string;
  defenseVsPosition: string;
  last3PassingAtt: number;
  seasonPassingAtt: number;
  projectedPassingAtt: number;
  redZonePassingAtt: number;
  yardsPerPassingAtt: number;
  last3RushingAtt: number;
  seasonRushingAtt: number;
  projectedRushingAtt: number;
  redZoneRushingAtt: number;
  yardsPerRushingAtt: number;
  last3Targets: number;
  seasonTargets: number;
  projectedTargets: number;
  redZoneTargets: number;
  yardsPerTarget: number;
  projectedUsage: number;
  last3PPG: number;
  last16PPG: number;
  averagePPG: number;
  floor: number;
  ceiling: number;
  projectedPoints: number;
  projectedValue: number;
  actualPoints: number;
  actualValue: number;
}
