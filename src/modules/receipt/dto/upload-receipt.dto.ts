import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const uploadReceiptSchema = z.object({
    file: z
        .any()
        .refine((file) => file && file.mimetype, {
            message: messages.missing(fieldKey.file),
        })
        .refine((file) => ['image/jpeg', 'image/png'].includes(file.mimetype), {
            message: messages.invalid(fieldKey.fileType),
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: messages.overThreshold(fieldKey.fileSize),
        }),
});

export type UploadReceiptDto = z.infer<typeof uploadReceiptSchema>;