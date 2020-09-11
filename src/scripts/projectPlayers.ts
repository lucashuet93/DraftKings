import { config } from 'dotenv';
import { ColumnValue } from 'tedious';
import {
  PlayerParser,
  PlayerProjectionService,
  SQLServerService,
  Timer,
} from '../services';
import {
  RotoGrindersPlayer,
  DailyFantasyFuelPlayer,
  NumberFirePlayer,
  DraftKingsAvailablePlayer,
  ProjectedPlayer,
  DailyFantasyNerdPlayer,
  FantasyDataPlayer,
} from '../models';

// load environment variables
config();

// wrap logic in async function so await keyword can be used
const projectPlayers = async () => {
  // initialize services
  const sqlServerService: SQLServerService = new SQLServerService();
  const playerParser: PlayerParser = new PlayerParser();
  const playerProjectionService: PlayerProjectionService = new PlayerProjectionService();
  const timer: Timer = new Timer();
  timer.start();

  // load service projections
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
  const rawFantasyData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'FantasyData'
  );
  const rawDailyFantasyNerdData: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'DailyFantasyNerd'
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
  const fantasyDataPlayers: FantasyDataPlayer[] = playerParser.parseFantasyDataPlayers(
    rawFantasyData
  );
  const dailyFantasyNerdPlayers: DailyFantasyNerdPlayer[] = playerParser.parseDailyFantasyNerdPlayers(
    rawDailyFantasyNerdData
  );

  // project players
  const playerProjections: ProjectedPlayer[] = playerProjectionService.projectPlayers(
    draftKingsAvailablePlayers,
    rotoGrindersPlayers,
    numberFirePlayers,
    dailyFantasyFuelPlayers,
    fantasyDataPlayers,
    dailyFantasyNerdPlayers
  );

  // print stats and save projections
  await sqlServerService.savePlayerProjections(playerProjections, 0, 0, () => {
    const elapsedMilliseconds: number = timer.end();
    const elapsedTime: string = timer.getTimeStringFromMilliseconds(
      elapsedMilliseconds
    );
    console.log(`Time Elapsed - ${elapsedTime}`);
    process.exit();
  });
};

projectPlayers();
