import { BadRequestException } from '@nestjs/common';
import { ValidateBy } from 'class-validator';

export const REPORT_TEXT_MAX_LENGTH = 4000;
export const REPORT_TEXT_LENGTH_ERROR =
  'Sutrumpinkite tekstą iki 4 000 simbolių';

export function isReportTextWithinLimit(value: unknown): value is string {
  // Match Dart String.length in the frontend, including spaces and newlines.
  return typeof value === 'string' && value.length <= REPORT_TEXT_MAX_LENGTH;
}

export function assertReportTextWithinLimit(value: unknown): void {
  if (!isReportTextWithinLimit(value)) {
    throw new BadRequestException(REPORT_TEXT_LENGTH_ERROR);
  }
}

export function IsReportTextWithinLimit(): PropertyDecorator {
  return ValidateBy({
    name: 'isReportTextWithinLimit',
    validator: {
      validate: isReportTextWithinLimit,
      defaultMessage: () => REPORT_TEXT_LENGTH_ERROR,
    },
  });
}
