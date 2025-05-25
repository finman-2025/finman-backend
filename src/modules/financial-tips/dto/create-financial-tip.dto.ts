import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';
import { nameRegex } from 'src/common/utils';

export const createFinancialTipSchema = z.object({
    author: z
        .string({ message: messages.missing(fieldKey.value) })
        .regex(nameRegex, { message: messages.invalid(fieldKey.author) })
        .nonempty(messages.invalid(fieldKey.value)),
    authorImage: z
        .string()
        .optional(),
    content: z
        .string({ message: messages.missing(fieldKey.content) })        
        .nonempty(messages.missing(fieldKey.content)),
    title: z
        .string({ message: messages.missing(fieldKey.title) })
        .nonempty(messages.invalid(fieldKey.title)),
    type: z
        .string({ message: messages.missing(fieldKey.type) })
        .nonempty(messages.missing(fieldKey.type)),
    date: z
        .string({ message: messages.missing(fieldKey.date) })
        .nonempty(messages.missing(fieldKey.date))
        .datetime(messages.invalid(fieldKey.date)),
});

export type CreateFinancialTipDto = z.infer<typeof createFinancialTipSchema>;