import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const loginSchema = z.object({
  username: z
    .string({ message: messages.missing(fieldKey.username) })
    .trim()
    .toLowerCase(),
  password: z.string({ message: messages.missing(fieldKey.password) }).trim(),
});

export type LoginDto = z.infer<typeof loginSchema>;
