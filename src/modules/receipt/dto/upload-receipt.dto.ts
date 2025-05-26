import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';
import { allowedImageTypes } from 'src/common/utils';

export const uploadReceiptSchema = z
  .object({
    mimetype: z.string().refine((val) => allowedImageTypes.includes(val), {
      message: messages.invalid(fieldKey.fileType),
    }),
    size: z.number().max(5 * 1024 * 1024, {
      message: messages.overThreshold(fieldKey.fileSize),
    }),
    name: z.string().optional(),
    path: z.string().optional(),
  })
  .refine((file) => !!file, {
    message: messages.missing(fieldKey.file),
  });

export type UploadReceiptDto = z.infer<typeof uploadReceiptSchema>;
