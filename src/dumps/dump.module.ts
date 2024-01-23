import { Module } from '@nestjs/common';
import { DumpController } from './dump.controller';
import { DumpService } from './dump.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dump, DumpSchema } from '../repositories/dumps/schemas';
import { DumpRepository } from '../repositories/dumps/dump.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dump.name, schema: DumpSchema }]),
  ],
  controllers: [DumpController],
  providers: [DumpService, DumpRepository],
})
export class DumpModule {}
