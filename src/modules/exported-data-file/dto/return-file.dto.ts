import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const returnFileSchema = z.object({
    fileName: z
        .string({ message: messages.missing(fieldKey.fileName) })
        .trim(),
    url: z
        .string({ message: messages.missing(fieldKey.url) })
        .url({ message: messages.invalid(fieldKey.url) })
        .trim(),
    createdAt: z
        .date()
        .refine(date => date <= new Date(), {
            message: messages.invalid(fieldKey.date),
        })
});

export type ReturnFileDto = z.infer<typeof returnFileSchema>;