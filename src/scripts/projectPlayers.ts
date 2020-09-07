import { config } from 'dotenv';
import { SQLServerService } from '../services';
import { ColumnValue } from 'tedious';

// load environment variables
config();

const projectPlayers = async () => {
  // wrap logic in async function so await keyword can be used
  const sqlServerService: SQLServerService = new SQLServerService();
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
  console.log('DKAvailable', rawDraftKingsAvailablesData.length);
  console.log('NumberFire', rawNumberFireData.length);
  console.log('DailyFantasyFuel', rawDailyFantasyFuelData.length);
  console.log('RotoGrinders', rawRotoGrindersData.length);
};

projectPlayers();
