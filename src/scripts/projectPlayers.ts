import { config } from 'dotenv';
import { SQLServerService } from '../services';
import { ColumnValue } from 'tedious';
import { PlayerProjectionService } from '../services/PlayerProjectionService';
import {
  RotoGrindersPlayer,
  DailyFantasyFuelPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
  ProjectedPlayer,
} from '../models';

// load environment variables
config();

const projectPlayers = async () => {
  // wrap logic in async function so await keyword can be used
  const sqlServerService: SQLServerService = new SQLServerService();
  const playerProjectionService: PlayerProjectionService = new PlayerProjectionService();
  let rawDraftKingsAvailablesData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'DraftKingsAvailables'
  );
  let rawRotoGrindersData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'RotoGrinders'
  );
  let rawNumberFireData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'NumberFire'
  );
  let rawDailyFantasyFuelData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'DailyFantasyFuel'
  );
  const draftKingsAvailablePlayers: DraftKingsAvailablePlayer[] = playerProjectionService.createDraftKingsAvailablePlayers(
    rawDraftKingsAvailablesData
  );
  const rotoGrindersPlayers: RotoGrindersPlayer[] = playerProjectionService.createRotoGrindersPlayers(
    rawRotoGrindersData
  );
  const numberFirePlayers: NumberFirePlayer[] = playerProjectionService.createNumberFirePlayers(
    rawNumberFireData
  );
  const dailyFantasyFuelPlayers: DailyFantasyFuelPlayer[] = playerProjectionService.createDailyFantasyFuelPlayers(
    rawDailyFantasyFuelData
  );
  const playerProjections: ProjectedPlayer[] = playerProjectionService.projectPlayers(
    draftKingsAvailablePlayers,
    rotoGrindersPlayers,
    numberFirePlayers,
    dailyFantasyFuelPlayers
  );
  await sqlServerService.savePlayerProjections(playerProjections);
};

projectPlayers();
