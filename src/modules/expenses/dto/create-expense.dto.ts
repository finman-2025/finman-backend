import { z } from 'zod';

import { ExpenseType } from '@prisma/client';

import { messages, fieldKey } from 'src/common/text';

export const createExpenseSchema = z.object({
  userId: z
    .number({ message: messages.missing(fieldKey.userId) })
    .int(messages.invalid(fieldKey.userId))
    .positive(messages.invalid(fieldKey.userId))
    .optional(),
  type: z.preprocess(
    (value) => value?.toString()?.toUpperCase(),
    z.nativeEnum(ExpenseType, {
      message: messages.invalid(fieldKey.expenseType),
    }),
  ),
  value: z
    .number({ message: messages.missing(fieldKey.value) })
    .int(messages.invalid(fieldKey.value))
    .positive(messages.invalid(fieldKey.value)),
  description: z
    .string()
    .transform((value) => (value ? value.trim() : undefined))
    .optional(),
  date: z
    .string({ message: messages.missing(fieldKey.date) })
    .nonempty(messages.missing(fieldKey.date))
    .datetime(messages.invalid(fieldKey.date)),
  categoryId: z
    .number({ message: messages.missing(fieldKey.categoryId) })
    .int(messages.invalid(fieldKey.categoryId))
    .optional(),
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
