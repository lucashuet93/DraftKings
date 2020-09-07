import { Connection, ConnectionConfig, Request, ColumnValue } from 'tedious';
import { ProjectedPlayer } from '../models';

export class SQLServerService {
  createConnection(): Connection {
    const config: ConnectionConfig = {
      server: process.env.SQL_SERVER_NAME,
      authentication: {
        type: 'default',
        options: {
          userName: process.env.SQL_SERVER_USERNAME,
          password: process.env.SQL_SERVER_PASSWORD,
        },
      },
      options: {
        database: 'DraftKings',
      },
    };
    return new Connection(config);
  }

  buildLoadRequestForTable(
    tableName: string,
    onError: (err: Error) => void
  ): Request {
    return new Request(`SELECT * FROM [dbo].[${tableName}];`, (err: Error) => {
      if (err) {
        onError(err);
      }
    });
  }

  async loadRawPlayerData(tableName: string): Promise<any[]> {
    const connection: Connection = this.createConnection();
    return new Promise<any[]>((resolve: Function, reject: Function) => {
      connection.on('connect', (err: Error) => {
        if (err) {
          reject(err);
        } else {
          const request: Request = this.buildLoadRequestForTable(
            tableName,
            (err: Error) => {
              reject(err);
            }
          );

          let results: ColumnValue[][] = [];
          request.on('row', (columns: ColumnValue[]) => {
            results.push(columns);
          });

          request.on('doneProc', () => {
            resolve(results);
          });

          connection.execSql(request);
        }
      });
    });
  }

  async savePlayerProjections(
    playerProjections: ProjectedPlayer[]
  ): Promise<void> {
    const connection: Connection = this.createConnection();
    return new Promise<void>((resolve: Function, reject: Function) => {
      connection.on('connect', (err: Error) => {
        if (err) {
          reject(err);
        } else {
          const recordValues: string[] = playerProjections.map(
            (player: ProjectedPlayer) => {
              const preparedFirstName: string = player.firstName.replace(
                `'`,
                `''`
              );
              const preparedLastName: string = player.lastName.replace(
                `'`,
                `''`
              );
              return `('${preparedFirstName}','${preparedLastName}','${player.playerId}','${player.position}',${player.salary},'${player.team}','${player.opponent}',${player.rotoGrindersProjection},${player.numberFireProjection},${player.dailyFantasyFuelProjection},${player.projectedPoints},${player.projectedValue},${player.averagePPG})`;
            }
          );
          const valueString: string = recordValues.join(',');
          const request: Request = new Request(
            `DELETE FROM [dbo].[PlayerProjections]; INSERT INTO [dbo].[PlayerProjections] (FirstName, LastName, PlayerId, Position, Salary, Team, Opponent, RotoGrindersProjection, NumberFireProjection, DailyFantasyFuelProjection, ProjectedPoints, ProjectedValue, AveragePPG) VALUES ${valueString};`,
            (err: Error) => {
              if (err) {
                reject(err);
              }
            }
          );
          connection.execSql(request);
        }
      });
    });
  }
}
