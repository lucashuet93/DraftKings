import { config } from 'dotenv';
import { ColumnValue } from 'tedious';
import {
  LineupOptimizer,
  PlayerParser,
  SQLServerService,
  SalaryAnalyzer,
} from '../services';
import { ProjectedPlayer, DraftKingsLineup } from '../models';

// load environment variables
config();

const optimizeLineups = async () => {
  // wrap logic in async function so await keyword can be used
  const sqlServerService: SQLServerService = new SQLServerService();
  const playerParser: PlayerParser = new PlayerParser();
  const salaryAnalyzer: SalaryAnalyzer = new SalaryAnalyzer();
  const lineupOptimizer: LineupOptimizer = new LineupOptimizer(salaryAnalyzer);

  const rawPlayerProjections: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'PlayerProjections'
  );
  const projectedPlayers: ProjectedPlayer[] = playerParser.parseProjectedPlayers(
    rawPlayerProjections
  );
  const optimizedLineups: DraftKingsLineup[] = lineupOptimizer.optimizeLineups(
    projectedPlayers,
    150
  );
};

optimizeLineups();
