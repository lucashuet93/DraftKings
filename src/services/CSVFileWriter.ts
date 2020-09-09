import { createObjectCsvWriter } from 'csv-writer';
import { CsvWriter } from 'csv-writer/src/lib/csv-writer';
import { DraftKingsLineup } from '../models';

export class CSVFileWriter {
  private csvWriter: CsvWriter<any>;
  constructor(outputFile: string) {
    this.csvWriter = createObjectCsvWriter({
      path: outputFile,
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
  }

  async writeLineupsToFile(lineups: DraftKingsLineup[]) {
    await this.csvWriter.writeRecords(lineups);
  }
}
