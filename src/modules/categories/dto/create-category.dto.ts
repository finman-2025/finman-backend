import { z } from 'zod';

import { ExpenseType } from '@prisma/client';

import { messages, fieldKey, collectionKey } from 'src/common/text';
import { nameRegex, uppercaseFirstLetter } from 'src/common/utils';

export const createCategorySchema = z.object({
  name: z
    .string({ message: messages.missing(fieldKey.categoryName) })
    .nonempty(messages.missing(fieldKey.categoryName))
    .regex(nameRegex, { message: messages.invalid(fieldKey.categoryName) })
    .transform((value) => uppercaseFirstLetter(value.trim())),
  limit: z
    .string()
    .transform((value) => (value ? Number(value.trim()) : undefined))
    .refine((value) => value === undefined || !isNaN(value) || value > 0, {
      message: messages.invalid(fieldKey.limit),
    })
    .optional(),
  type: z.preprocess(
    (value) => value?.toString()?.toUpperCase(),
    z.nativeEnum(ExpenseType, {
      message: messages.invalid(fieldKey.expenseType, collectionKey.category),
    }),
  ),
  image: z
    .string()
    .transform((value) => (value ? value.trim() : undefined))
    .optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
