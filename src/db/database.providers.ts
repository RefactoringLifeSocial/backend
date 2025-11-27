import { Module } from '@nestjs/common';
import { User } from 'src/features/users/entities/user.entity';
import { DataSource } from 'typeorm';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'root';
const DB_NAME = process.env.DB_NAME || 'huella';

@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'mysql',
          host: DB_HOST,
          port: DB_PORT,
          username: DB_USER,
          password: DB_PASS,
          database: DB_NAME,
          entities: [User],
          synchronize: true,
        });
        return dataSource.initialize();
      },
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule {}
