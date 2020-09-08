import { config } from 'dotenv';
import { ColumnValue } from 'tedious';
import {
  LineupAnalyzer,
  LineupOptimizer,
  PlayerParser,
  SQLServerService,
  SalaryAnalyzer,
  Timer,
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
  const lineupAnalyzer: LineupAnalyzer = new LineupAnalyzer();
  const timer: Timer = new Timer();

  timer.start();
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
  lineupAnalyzer.printLineupStatistics(projectedPlayers, optimizedLineups);
  await sqlServerService.saveTopLineups(optimizedLineups, () => {
    const elapsedMilliseconds: number = timer.end();
    const elapsedTime: string = timer.getTimeStringFromMilliseconds(
      elapsedMilliseconds
    );
    console.log(`Time Elapsed - ${elapsedTime}`);
    process.exit();
  });
};

optimizeLineups();
