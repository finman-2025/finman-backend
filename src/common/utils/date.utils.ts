import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export const getFirstDateOfMonth = (date?: Dayjs | Date | string): Date =>
  dayjs(date ?? new Date())
    .startOf('month')
    .toDate();

export const getLastDateOfMonth = (date?: Dayjs | Date | string): Date =>
  dayjs(date ?? new Date())
    .endOf('month')
    .toDate();

export const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

export const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};
