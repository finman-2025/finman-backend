import { z } from 'zod';
import { ExpenseType } from '@prisma/client';
import { fieldKey, messages, responseMessage } from 'src/common/text';

export const getSpentSchema = z
  .object({
    startDate: z
      .string()
      .date(messages.invalid(fieldKey.date))
      .transform((value) => new Date(value))
      .optional(),
    endDate: z
      .string()
      .date(messages.invalid(fieldKey.date))
      .transform((value) => new Date(value))
      .optional(),
    categoryId: z.coerce
      .number({ message: messages.invalid(fieldKey.categoryId) })
      .int(messages.invalid(fieldKey.categoryId))
      .optional(),
  })
  .refine(
    ({ startDate, endDate }) => (!startDate && !endDate) || startDate < endDate,
    { message: responseMessage.startDateBeforeEndDate },
  );

export type GetSpentDto = z.infer<typeof getSpentSchema>;
