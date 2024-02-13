import { Injectable } from '@nestjs/common';
import { DumpRepository } from '../repositories/dumps/dump.repository';
import { DumpDto } from './dto';
import { Dump } from '../repositories/dumps/schemas';

@Injectable()
export class DumpService {
  constructor(private readonly dumpRepository: DumpRepository) {}

  async getAllVisibleDumps(): Promise<DumpDto[]> {
    const dumps = await this.dumpRepository.getVisibleDumps();
    return dumps.map(this.docToPublicDump);
  }

  private docToPublicDump(e: Dump): DumpDto {
    return new DumpDto(
      e.name,
      e.reportLong,
      e.reportLat,
      e.address,
      e.phone,
      e.workingHours,
      e.moreInformation,
    );
  }
}
