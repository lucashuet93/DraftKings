import { config } from 'dotenv';
import { SQLServerService } from '../services';

// load environment variables
config();

const sqlServerService: SQLServerService = new SQLServerService();
sqlServerService.connect();
