import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';
import { nameRegex, sexRegex } from 'src/common/utils';

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
        .optional(),
    sex: z
        .string({ message: messages.missing(fieldKey.sex) })
        .nonempty(messages.missing(fieldKey.sex))
        .regex(sexRegex, { message: messages.invalid(fieldKey.sex) })
        .optional(),
    dateOfBirth: z
        .string({ message: messages.missing(fieldKey.dateOfBirth) })
        .nonempty(messages.missing(fieldKey.dateOfBirth))
        .datetime(messages.invalid(fieldKey.dateOfBirth))
        .optional(),
    address: z
        .string({ message: messages.missing(fieldKey.address) })
        .nonempty(messages.missing(fieldKey.address))
        .regex(nameRegex, { message: messages.invalid(fieldKey.address) })
        .transform((value) => value.trim())
        .optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;