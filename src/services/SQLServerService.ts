import { Connection, ConnectionConfig } from 'tedious';

export class SQLServerService {
  connect(): void {
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
    const connection: Connection = new Connection(config);
    connection.on('connect', function (err: any) {
      if (err) {
        console.log(err);
      }
      // If no error, then good to proceed.
      console.log('Connected');
    });
  }
}
