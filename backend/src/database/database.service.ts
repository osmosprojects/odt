import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Check if TypeORM connected
      if (this.dataSource.isInitialized) {
        this.logger.log('✅ Database Connected Successfully');
      } else {
        this.logger.error('❌ Database Not Connected');
        return;
      }

      // Execute a simple query
      const result = await this.dataSource.query(
        'SELECT DATABASE() AS databaseName, NOW() AS currentTime'
      );

      this.logger.log('======================================');
      this.logger.log('Database Information');
      this.logger.log(`Database : ${result[0].databaseName}`);
      this.logger.log(`Time     : ${result[0].currentTime}`);
      this.logger.log('======================================');

    } catch (error) {
      this.logger.error('❌ Database Connection Failed');
      this.logger.error(error);
    }
  }
}