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
        .string()
        .date(messages.invalid(fieldKey.date))
        .transform((value) => new Date(value))
});

export type ReturnFileDto = z.infer<typeof returnFileSchema>;