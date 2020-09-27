import { config } from 'dotenv';
import { ColumnValue } from 'tedious';
import {
  CSVFileWriter,
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

// wrap logic in async function so await keyword can be used
const optimizeLineups = async () => {
  // initialize services
  const sqlServerService: SQLServerService = new SQLServerService();
  const playerParser: PlayerParser = new PlayerParser();
  const salaryAnalyzer: SalaryAnalyzer = new SalaryAnalyzer();
  const lineupOptimizer: LineupOptimizer = new LineupOptimizer(salaryAnalyzer);
  const lineupAnalyzer: LineupAnalyzer = new LineupAnalyzer();
  const timer: Timer = new Timer();
  const outputFile: string = 'optimizedLineups.csv';
  const csvFileWriter: CSVFileWriter = new CSVFileWriter(outputFile);
  timer.start();

  // load player projections
  const rawPlayerProjections: ColumnValue[][] = await sqlServerService.loadRawPlayerData(
    'PlayerProjections'
  );
  const projectedPlayers: ProjectedPlayer[] = playerParser.parseProjectedPlayers(
    rawPlayerProjections
  );

  // optimize lineups
  const optimizedLineups: DraftKingsLineup[] = lineupOptimizer.optimizeLineups(
    projectedPlayers,
    parseInt(process.argv[2])
  );

  // print stats and save lineups
  await csvFileWriter.writeLineupsToFile(optimizedLineups);
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
