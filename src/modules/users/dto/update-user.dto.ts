import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';
import { nameRegex } from 'src/common/utils';

export const updateUserSchema = z.object({
    name: z
        .string({ message: messages.missing(fieldKey.name) })
        .nonempty(messages.missing(fieldKey.name))
        .regex(nameRegex, { message: messages.invalid(fieldKey.name) })
        .transform((value) => value.trim())
        .optional(),
    email: z
        .string({ message: messages.missing(fieldKey.email) })
        .nonempty(messages.missing(fieldKey.email))
        .email(messages.invalid(fieldKey.email))
        .optional(),
    phoneNumber: z
        .string({ message: messages.missing(fieldKey.email) })
        .nonempty(messages.missing(fieldKey.email))
        .min(10, { message: messages.invalid(fieldKey.email) })
        .optional()
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;