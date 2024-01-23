import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dump } from './schemas';
import { UpdateDumpDto } from '../../admin/dto/update-dump.dto';
import { CreateDumpDto } from '../../admin/dto';

export class DumpRepository {
  constructor(@InjectModel(Dump.name) private dumpModel: Model<Dump>) {}

  async getVisibleDumps(): Promise<Dump[]> {
    return await this.dumpModel.find({ isVisible: true }).exec();
  }

  async getAllDumps(): Promise<Dump[]> {
    return await this.dumpModel.find().exec();
  }

  async createDump(createDump: CreateDumpDto): Promise<Dump> {
    const newDump = new this.dumpModel({
      name: createDump.name,
      type: 'dump',
      reportLong: createDump.reportLong,
      reportLat: createDump.reportLat,
      status: 'gautas',
      reportDate: Date.now(),
      isVisible: false,
      address: createDump.address != null ? createDump.address : '',
      phone: createDump.phone != null ? createDump.phone : '',
      workingHours:
        createDump.workingHours != null ? createDump.workingHours : '',
      moreInformation:
        createDump.moreInformation != null ? createDump.moreInformation : '',
    });
    return await newDump.save();
  }
  getDumpById(id: string) {
    return this.dumpModel.findOne({ _id: id }).exec();
  }
  async updateDump(updateDump: UpdateDumpDto): Promise<Dump | null> {
    const dump = await this.getDumpById(updateDump._id);
    if (dump == null) {
      return null;
    }
    return this.dumpModel
      .findOneAndUpdate(
        {
          _id: updateDump._id,
        },
        {
          $set: {
            name: updateDump.name,
            reportLong: updateDump.longitude,
            reportLat: updateDump.latitude,
            isVisible: updateDump.isVisible,
            address: updateDump.address,
            phone: updateDump.phone,
            workingHours: updateDump.workingHours,
            moreInformation: updateDump.moreInformation,
          },
        },
      )
      .exec();
  }
}
