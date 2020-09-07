import { Connection, ConnectionConfig, Request, ColumnValue } from 'tedious';

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

  buildRequestForTable(
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
          const request: Request = this.buildRequestForTable(
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
}
