import { ApiProperty } from '@nestjs/swagger';
import { ToBoolean } from '../../common/transform/boolean.transform';
import { ReportCategory } from 'src/common/dto/report-category';

export class UpdateReportDto {
  @ApiProperty()
  refId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: ReportCategory;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  @ToBoolean()
  isVisible: boolean;

  @ApiProperty()
  @ToBoolean()
  isDeleted: boolean;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  officerImageUrls: string[];

  @ApiProperty()
  imageUrls: string[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: any[];

  constructor(
    refId: string,
    name: string,
    category: ReportCategory,
    longitude: number,
    latitude: number,
    isVisible: boolean,
    isDeleted: boolean,
    comment: string,
    status: string,
    officerImageUrls: string[],
    imageUrls: string[],
    images: any[],
  ) {
    this.refId = refId;
    this.name = name;
    this.category = category;
    this.longitude = longitude;
    this.latitude = latitude;
    this.isVisible = isVisible;
    this.isDeleted = isDeleted;
    this.comment = comment;
    this.status = status;
    this.officerImageUrls = officerImageUrls;
    this.imageUrls = imageUrls;
    this.images = images;
  }
}
