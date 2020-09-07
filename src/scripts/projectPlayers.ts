import { config } from 'dotenv';
import { SQLServerService } from '../services';
import { ColumnValue } from 'tedious';
import { PlayerProjectionService } from '../services/PlayerProjectionService';
import {
  RotoGrindersPlayer,
  DailyFantasyFuelPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
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
  let rawNumberFireData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'NumberFire'
  );
  let rawDailyFantasyFuelData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'DailyFantasyFuel'
  );
  let rawRotoGrindersData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'RotoGrinders'
  );
  const rotoGrindersPlayers: RotoGrindersPlayer[] = playerProjectionService.createRotoGrindersPlayers(
    rawRotoGrindersData
  );
  const dailyFantasyFuelPlayers: DailyFantasyFuelPlayer[] = playerProjectionService.createDailyFantasyFuelPlayers(
    rawDailyFantasyFuelData
  );
  const numberFirePlayers: NumberFirePlayer[] = playerProjectionService.createNumberFirePlayers(
    rawNumberFireData
  );
  const draftKingsAvailablePlayers: DraftKingsAvailablePlayer[] = playerProjectionService.createDraftKingsAvailablePlayers(
    rawDraftKingsAvailablesData
  );
};

projectPlayers();
