import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),

    // MongooseModule.forRoot('mongodb://localhost:27017/your-database-name'), // Replace with your MongoDB connection string
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongooseModuleRoot {}
