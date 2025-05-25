import { z } from 'zod';

import { ExpenseType } from '@prisma/client';

import { messages, fieldKey } from 'src/common/text';
import { nameRegex } from 'src/common/utils';

export const updateExpenseSchema = z.object({
  type: z.preprocess(
    (value) => value?.toString()?.toUpperCase(),
    z
      .nativeEnum(ExpenseType, {
        message: messages.invalid(fieldKey.expenseType),
      })
      .optional(),
  ),
  value: z
    .number({ message: messages.missing(fieldKey.value) })
    .int(messages.invalid(fieldKey.value))
    .positive(messages.invalid(fieldKey.value))
    .optional(),
  description: z
    .string({ message: messages.missing(fieldKey.description) })
    .nonempty(messages.missing(fieldKey.description))
    .regex(nameRegex, { message: messages.invalid(fieldKey.description) })
    .transform((value) => value.trim())
    .optional(),
  date: z
    .string({ message: messages.missing(fieldKey.date) })
    .nonempty(messages.missing(fieldKey.date))
    .datetime(messages.invalid(fieldKey.date))
    .optional(),
  categoryId: z
    .number({ message: messages.missing(fieldKey.categoryId) })
    .int(messages.invalid(fieldKey.categoryId))
    .positive(messages.invalid(fieldKey.categoryId))
    .optional(),
});

export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
