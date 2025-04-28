import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';
import { nameRegex } from 'src/common/utils';

export const registerSchema = z.object({
    username: z
        .string({ message: messages.missing(fieldKey.username) })
        .nonempty(messages.missing(fieldKey.username))
        .regex(/^[a-z0-9_]+$/i, { message: messages.invalid(fieldKey.username) })
        .toLowerCase(),
      password: z
        .string({ message: messages.missing(fieldKey.password) })
        .nonempty(messages.missing(fieldKey.password)),
      email: z
        .string({ message: messages.missing(fieldKey.email) })
        .nonempty(messages.missing(fieldKey.email))
        .email(messages.invalid(fieldKey.email)),
      name: z
        .string({ message: messages.missing(fieldKey.name) })
        .nonempty(messages.missing(fieldKey.name))
        .regex(nameRegex, { message: messages.invalid(fieldKey.name) })
        .transform((value) => value.trim())
});

export type RegisterDto = z.infer<typeof registerSchema>;