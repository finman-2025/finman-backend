import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const fileNameSchema = z.object({
    fileName: z
        .string({ message: messages.missing(fieldKey.fileName) })
        .trim(),
});

export type FileNameDto = z.infer<typeof fileNameSchema>;