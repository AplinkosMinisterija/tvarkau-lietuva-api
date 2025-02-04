import { Module } from '@nestjs/common';
import { PermitController } from './permit.controller';
import { PermitService } from './permit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Permit, PermitSchema } from '../repositories/permit/schemas';
import { PermitRepository } from '../repositories/permit/permit.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permit.name, schema: PermitSchema }]),
  ],
  controllers: [PermitController],
  providers: [PermitService, PermitRepository],
})
export class PermitModule {}
