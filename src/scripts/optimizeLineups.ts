import { config } from 'dotenv';
import { ColumnValue } from 'tedious';
import { PlayerParser, SQLServerService } from '../services';
import { ProjectedPlayer } from '../models';

// load environment variables
config();

const projectPlayers = async () => {
  // wrap logic in async function so await keyword can be used
  const sqlServerService: SQLServerService = new SQLServerService();
  const playerParser: PlayerParser = new PlayerParser();

  const rawPlayerProjections: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'PlayerProjections'
  );

  const projectedPlayers: ProjectedPlayer[] = playerParser.parseProjectedPlayers(
    rawPlayerProjections
  );

  console.log(projectedPlayers);
};

projectPlayers();
