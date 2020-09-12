import { Connection, ConnectionConfig, Request, ColumnValue } from 'tedious';
import { ProjectedPlayer, DraftKingsLineup } from '../models';

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
    connection: Connection,
    onError: (err: Error) => void
  ): Request {
    return new Request(`SELECT * FROM [dbo].[${tableName}];`, (err: Error) => {
      connection.close();
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
            connection,
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
    playerProjections: ProjectedPlayer[],
    minProjectedPoints: number,
    minProjectionServices: number,
    onComplete: () => void
  ): Promise<void> {
    const connection: Connection = this.createConnection();
    return new Promise<void>((resolve: Function, reject: Function) => {
      connection.on('connect', (err: Error) => {
        if (err) {
          reject(err);
        } else {
          const recordValues: string[] = playerProjections
            .filter((player: ProjectedPlayer) => {
              // filter out players without projections from a certain number of services, or below a given projection threshold
              let totaProjectionServices: number = 0;
              if (player.rotoGrindersProjection > 0) totaProjectionServices++;
              if (player.numberFireProjection > 0) totaProjectionServices++;
              if (player.dailyFantasyFuelProjection > 0)
                totaProjectionServices++;
              return (
                player.projectedPoints >= minProjectedPoints &&
                totaProjectionServices >= minProjectionServices
              );
            })
            .map((player: ProjectedPlayer) => {
              const preparedFirstName: string = player.firstName.replace(
                `'`,
                `''`
              );
              const preparedLastName: string = player.lastName.replace(
                `'`,
                `''`
              );
              return `('${preparedFirstName}','${preparedLastName}','${player.playerId}','${player.position}',${player.salary},'${player.team}','${player.opponent}',${player.rotoGrindersProjection},${player.numberFireProjection},${player.dailyFantasyFuelProjection},${player.fantasyDataProjection},${player.dailyFantasyNerdProjection},${player.projectedPoints},${player.projectedValue},${player.averagePPG})`;
            });
          const valueString: string = recordValues.join(',');
          const request: Request = new Request(
            `DELETE FROM [dbo].[PlayerProjections]; INSERT INTO [dbo].[PlayerProjections] (FirstName, LastName, PlayerId, Position, Salary, Team, Opponent, RotoGrindersProjection, NumberFireProjection, DailyFantasyFuelProjection, FantasyDataProjection, DailyFantasyNerdProjection, ProjectedPoints, ProjectedValue, AveragePPG) VALUES ${valueString};`,
            (err: Error) => {
              connection.close();
              if (err) {
                reject(err);
              }
            }
          );
          request.on('doneProc', () => {
            onComplete();
          });
          connection.execSql(request);
        }
      });
    });
  }

  async saveTopLineups(
    topLineups: DraftKingsLineup[],
    onComplete: () => void
  ): Promise<void> {
    const connection: Connection = this.createConnection();
    return new Promise<void>((resolve: Function, reject: Function) => {
      connection.on('connect', (err: Error) => {
        if (err) {
          reject(err);
        } else {
          const recordValues: string[] = topLineups.map(
            (lineup: DraftKingsLineup) => {
              return `('${lineup.QB}','${lineup.RB1}','${lineup.RB2}',${lineup.WR1},'${lineup.WR2}','${lineup.WR3}','${lineup.TE}','${lineup.FLEX}','${lineup.DST}',${lineup.projectedPoints},${lineup.totalSalary})`;
            }
          );
          const valueString: string = recordValues.join(',');
          const request: Request = new Request(
            `DELETE FROM [dbo].[DraftKingsLineups]; INSERT INTO [dbo].[DraftKingsLineups] (QB, RB1, RB2, WR1, WR2, WR3, TE, FLEX, DST, ProjectedPoints, TotalSalary) VALUES ${valueString};`,
            (err: Error) => {
              connection.close();
              if (err) {
                reject(err);
              }
            }
          );
          request.on('doneProc', () => {
            onComplete();
          });
          connection.execSql(request);
        }
      });
    });
  }
}
