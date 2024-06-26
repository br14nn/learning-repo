import { Module } from '@nestjs/common';
import { GogoanimeService } from './gogoanime.service';
import { GogoanimeController } from './gogoanime.controller';

@Module({
  providers: [GogoanimeService],
  controllers: [GogoanimeController]
})
export class GogoanimeModule {}
