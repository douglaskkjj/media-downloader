import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}