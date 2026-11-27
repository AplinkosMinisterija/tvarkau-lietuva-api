import { BadRequestException, ValidationPipe } from '@nestjs/common';
import axios from 'axios';
import { AdminService } from '../admin/admin.service';
import { TransferReportDto, UpdateReportDto } from '../admin/dto';
import { DumpRepository } from '../repositories/dumps/dump.repository';
import { ReportRepository } from '../repositories/reports/report.repository';
import { CreateReportDto } from '../report/dto';
import { ReportService } from '../report/report.service';
import { ReportCategory } from './dto/report-category';
import { REPORT_TEXT_LENGTH_ERROR } from './report-text';

jest.mock('axios');

const createReport = (name: string): CreateReportDto => ({
  name,
  longitude: 25,
  latitude: 54,
  category: ReportCategory.trash,
  email: 'reporter@example.test',
  automaticEmailsEnabled: false,
  images: [],
});

const transferReport = (name: string) =>
  new TransferReportDto(
    name,
    '1',
    25,
    54,
    'gautas',
    new Date('2026-01-01T00:00:00Z'),
    'officer@example.test',
    'test',
  );

describe('Report text request validation', () => {
  const pipe = new ValidationPipe({ transform: true });

  describe.each([
    { name: 'new report', dto: CreateReportDto, payload: createReport },
    { name: 'AADIS transfer', dto: TransferReportDto, payload: transferReport },
  ])('$name', ({ dto, payload }) => {
    it.each([3999, 4000])(
      'accepts %i UTF-16 code units unchanged',
      async (length) => {
        const text = 'ą'.repeat(length - 2) + ' \n';
        const result = await pipe.transform(payload(text), {
          type: 'body',
          metatype: dto,
        });
        expect(result.name).toBe(text);
      },
    );

    it.each([
      'a'.repeat(4001),
      'ą'.repeat(4000) + ' ',
      '😀'.repeat(2000) + 'a',
    ])(
      'rejects over-limit text with a readable HTTP 400 response',
      async (text) => {
        await expect(
          pipe.transform(payload(text), { type: 'body', metatype: dto }),
        ).rejects.toMatchObject({
          response: {
            statusCode: 400,
            message: expect.arrayContaining([REPORT_TEXT_LENGTH_ERROR]),
          },
        });
      },
    );

    it('counts supplementary characters as two UTF-16 code units', async () => {
      const text = '😀'.repeat(2000);
      const result = await pipe.transform(payload(text), {
        type: 'body',
        metatype: dto,
      });
      expect(result.name).toBe(text);
    });
  });
});

describe('Report text service safeguards', () => {
  const repository = {
    createReport: jest.fn(),
    updateReport: jest.fn().mockResolvedValue(null),
    updateTransferReport: jest.fn(),
    getReportById: jest.fn(),
  };
  const reportService = new ReportService(
    repository as unknown as ReportRepository,
  );
  const adminService = new AdminService(
    {} as DumpRepository,
    repository as unknown as ReportRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    repository.getReportById.mockResolvedValue(null);
  });

  it('rejects a new over-limit report before images, email or storage', async () => {
    await expect(
      reportService.createReport(createReport('a'.repeat(4001)), []),
    ).rejects.toThrow(REPORT_TEXT_LENGTH_ERROR);
    expect(repository.createReport).not.toHaveBeenCalled();
  });

  it('rejects an over-limit AADIS transfer before the HTTP request or database update', async () => {
    await expect(
      adminService.transferReport(transferReport('a'.repeat(4001)), 'editor'),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(axios.request).not.toHaveBeenCalled();
    expect(repository.updateTransferReport).not.toHaveBeenCalled();
  });

  it('sends a 4000-unit AADIS payload without trimming or truncating it', async () => {
    const text = 'ą'.repeat(3998) + ' \n';
    jest.mocked(axios.request).mockResolvedValue({
      status: 200,
      data: { inspection: 'TEST-1', inspectionId: 'test-id' },
    });
    await adminService.transferReport(transferReport(text), 'editor');
    const [request] = jest.mocked(axios.request).mock.calls[0];
    expect(request.data).toEqual(expect.any(String));
    expect(JSON.parse(request.data as string).Turinys).toBe(text);
    expect(repository.updateTransferReport).toHaveBeenCalled();
  });

  it('preserves unchanged legacy text when another field is edited', async () => {
    const name = 'ą'.repeat(5171);
    repository.getReportById.mockResolvedValue({ name });
    const update = { refId: '1', name, status: 'tiriamas' } as UpdateReportDto;
    await adminService.updateReport(update, [], 'editor');
    expect(repository.updateReport).toHaveBeenCalledWith(update, [], 'editor');
    expect(update.name).toBe(name);
  });

  it('rejects changed over-limit legacy text before saving any field', async () => {
    repository.getReportById.mockResolvedValue({ name: 'a'.repeat(5171) });
    const update = { refId: '1', name: 'a'.repeat(4001) } as UpdateReportDto;
    await expect(
      adminService.updateReport(update, [], 'editor'),
    ).rejects.toThrow(REPORT_TEXT_LENGTH_ERROR);
    expect(repository.updateReport).not.toHaveBeenCalled();
  });

  it('allows a legacy report to be deliberately shortened to the limit', async () => {
    const update = { refId: '1', name: 'a'.repeat(4000) } as UpdateReportDto;
    await adminService.updateReport(update, [], 'editor');
    expect(repository.updateReport).toHaveBeenCalledWith(update, [], 'editor');
  });
});
