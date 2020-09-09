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
import { createObjectCsvWriter } from 'csv-writer';
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
  const csvWriter = createObjectCsvWriter({
    path: 'out.csv',
    header: [
      { id: 'QB', title: 'QB' },
      { id: 'RB1', title: 'RB' },
      { id: 'RB2', title: 'RB' },
      { id: 'WR1', title: 'WR' },
      { id: 'WR2', title: 'WR' },
      { id: 'WR3', title: 'WR' },
      { id: 'TE', title: 'TE' },
      { id: 'FLEX', title: 'FLEX' },
      { id: 'DST', title: 'DST' },
    ],
  });
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
  await csvWriter.writeRecords(optimizedLineups);
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
