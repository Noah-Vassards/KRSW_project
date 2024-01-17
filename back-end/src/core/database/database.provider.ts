import { Sequelize } from 'sequelize-typescript';
import { Movies } from 'src/modules/movies/movies.entity';
import { User } from 'src/modules/users/user.entity';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from '../constants';
import { databaseConfig } from './database.config';
import { IDatabaseConfigAttributes } from './dbConfig.interface';

export const databaseProviders = [{
   provide: SEQUELIZE,
   useFactory: async () => {
      let config: IDatabaseConfigAttributes;
      switch (process.env.NODE_ENV) {
         case DEVELOPMENT:
            config = databaseConfig.development;
            break;
         case TEST:
            config = databaseConfig.test;
            break;
         case PRODUCTION:
            config = databaseConfig.production;
            break;
         default:
            config = databaseConfig.development;
      }
      console.log(config)
      const sequelize = new Sequelize(config.database, config.username, config.password, {dialect: config.dialect, host: config.host, port: config.port});
      console.log('sequelize here')
      sequelize.addModels([User]);
      console.log('sequelize models')
      await sequelize.sync();
      console.log('sequelize sync')
      return sequelize;
   },
}];

