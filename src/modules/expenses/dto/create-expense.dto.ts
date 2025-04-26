import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';
import { nameRegex } from 'src/common/utils';

export const createExpenseSchema = z.object({
    value: z
        .number({ message: messages.missing(fieldKey.value) })
        .int(messages.invalid(fieldKey.value))
        .positive(messages.invalid(fieldKey.value)),
    description: z
        .string({ message: messages.missing(fieldKey.description) })        
        .nonempty(messages.missing(fieldKey.description))
        .regex(nameRegex, { message: messages.invalid(fieldKey.description) })
        .transform((value) => value.trim())
        .optional(),
    date: z
        .string({ message: messages.missing(fieldKey.date) })
        .nonempty(messages.missing(fieldKey.date))
        .datetime(messages.invalid(fieldKey.date)),
    userId: z
        .number({ message: messages.missing(fieldKey.userId) })
        .int(messages.invalid(fieldKey.userId))
        .positive(messages.invalid(fieldKey.userId)),
    categoryId: z
        .number({ message: messages.missing(fieldKey.categoryId) })
        .int(messages.invalid(fieldKey.categoryId))
        .positive(messages.invalid(fieldKey.categoryId))
        .optional()
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;