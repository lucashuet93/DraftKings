import { config } from 'dotenv';
import { ColumnValue } from 'tedious';
import {
  PlayerParser,
  PlayerProjectionService,
  SQLServerService,
} from '../services';
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
  const playerParser: PlayerParser = new PlayerParser();
  const playerProjectionService: PlayerProjectionService = new PlayerProjectionService();

  const rawDraftKingsAvailablesData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'DraftKingsAvailables'
  );
  const rawRotoGrindersData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'RotoGrinders'
  );
  const rawNumberFireData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'NumberFire'
  );
  const rawDailyFantasyFuelData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'DailyFantasyFuel'
  );

  const draftKingsAvailablePlayers: DraftKingsAvailablePlayer[] = playerParser.parseDraftKingsAvailablePlayers(
    rawDraftKingsAvailablesData
  );
  const rotoGrindersPlayers: RotoGrindersPlayer[] = playerParser.parseRotoGrindersPlayers(
    rawRotoGrindersData
  );
  const numberFirePlayers: NumberFirePlayer[] = playerParser.parseNumberFirePlayers(
    rawNumberFireData
  );
  const dailyFantasyFuelPlayers: DailyFantasyFuelPlayer[] = playerParser.parseDailyFantasyFuelPlayers(
    rawDailyFantasyFuelData
  );
  const playerProjections: ProjectedPlayer[] = playerProjectionService.projectPlayers(
    draftKingsAvailablePlayers,
    rotoGrindersPlayers,
    numberFirePlayers,
    dailyFantasyFuelPlayers
  );
  await sqlServerService.savePlayerProjections(playerProjections, 3);
};

projectPlayers();
