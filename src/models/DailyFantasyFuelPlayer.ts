export interface DailyFantasyFuelPlayer {
  fullName: string;
  position: string;
  injuryStatus: string;
  gameDate: string;
  slate: string;
  team: string;
  opponent: string;
  spread: number;
  overUnder: number;
  impliedTeamScore: number;
  salary: number;
  last5DvPRank: number;
  last5PPGFloor: number;
  last5PPGAverage: number;
  last5PPGCeiling: number;
  projectedPoints: number;
  projectedValue: number;
  actualPoints: number;
  actualValue: number;
}
