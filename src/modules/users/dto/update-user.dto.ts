import { z } from 'zod';

import { Gender } from '@prisma/client';

import { messages, fieldKey } from 'src/common/text';
import { nameRegex } from 'src/common/utils';

export const updateUserSchema = z.object({
  name: z
    .string()
    .nonempty(messages.missing(fieldKey.name))
    .regex(nameRegex, { message: messages.invalid(fieldKey.name) })
    .transform((value) => value.trim())
    .optional(),
  email: z
    .string()
    .nonempty(messages.missing(fieldKey.email))
    .email(messages.invalid(fieldKey.email))
    .optional(),
  phoneNumber: z
    .string()
    .nonempty(messages.missing(fieldKey.phoneNumber))
    .min(10, { message: messages.invalid(fieldKey.phoneNumber) })
    .optional(),
  sex: z.preprocess(
    (value) => value?.toString()?.toUpperCase(),
    z
      .nativeEnum(Gender, { message: messages.invalid(fieldKey.sex) })
      .optional(),
  ),
  dateOfBirth: z
    .string()
    .date(messages.invalid(fieldKey.date))
    .transform((value) => new Date(value))
    .optional(),
  address: z
    .string()
    .nonempty(messages.missing(fieldKey.address))
    .transform((value) => value.trim())
    .optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
