import { z } from 'zod';
import { ExpenseType } from '@prisma/client';
import { fieldKey, messages, responseMessage } from 'src/common/text';

export const getAnalyticsSchema = z
  .object({
    startDate: z
      .string()
      .date(messages.invalid(fieldKey.date))
      .transform((value) => new Date(value)),
    endDate: z
      .string()
      .date(messages.invalid(fieldKey.date))
      .transform((value) => new Date(value)),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: responseMessage.startDateBeforeEndDate,
  });

export type GetAnalyticsDto = z.infer<typeof getAnalyticsSchema>;
