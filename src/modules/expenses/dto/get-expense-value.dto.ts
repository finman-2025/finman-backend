import { z } from 'zod';
import { fieldKey, messages, responseMessage } from 'src/common/text';

export const getExpenseValueSchema = z
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

export type GetExpenseValueDto = z.infer<typeof getExpenseValueSchema>;
