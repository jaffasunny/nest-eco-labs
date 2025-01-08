import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModuleRoot } from './shared/database/mongoose.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModuleRoot, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
