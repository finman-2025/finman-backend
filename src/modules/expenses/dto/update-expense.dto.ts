import { z } from 'zod';
import { ExpenseType } from '@prisma/client';

import { messages, fieldKey, collectionKey } from 'src/common/text';
import { nameRegex } from 'src/common/utils';

export const updateExpenseSchema = z.object({
  value: z
    .number({ message: messages.missing(fieldKey.value) })
    .int(messages.invalid(fieldKey.value))
    .positive(messages.invalid(fieldKey.value))
    .optional(),
  description: z
    .string()
    .nonempty(messages.missing(fieldKey.description))
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
    .optional(),
});

export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
