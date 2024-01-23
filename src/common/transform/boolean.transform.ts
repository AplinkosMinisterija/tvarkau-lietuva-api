import { Transform } from 'class-transformer';

export function ToBoolean(): (target: any, key: string) => void {
  return Transform(
    (value: any) =>
      value.value === 'true' ||
      value.value === true ||
      value.value === 1 ||
      value.value === '1',
  );
}
