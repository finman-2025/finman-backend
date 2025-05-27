import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const changePasswordSchema = z.object({
    username: z
        .string({ message: messages.missing(fieldKey.username) })
        .nonempty(messages.missing(fieldKey.username))
        .regex(/^[a-z0-9_]+$/i, { message: messages.invalid(fieldKey.username) })
        .toLowerCase(),
    oldPassword: z
        .string({ message: messages.missing(fieldKey.password) })
        .nonempty(messages.missing(fieldKey.password)),
    newPassword: z
        .string({ message: messages.missing(fieldKey.password) })
        .nonempty(messages.missing(fieldKey.password))
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;