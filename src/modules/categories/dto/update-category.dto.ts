import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

import { nameRegex, uppercaseFirstLetter } from 'src/common/utils';

export const updateCategorySchema = z.object({
  name: z
    .string()
    .regex(nameRegex, { message: messages.invalid(fieldKey.categoryName) })
    .transform((value) =>
      value ? uppercaseFirstLetter(value.trim()) : undefined,
    )
    .optional(),
  limit: z
    .number()
    .int(messages.invalid(fieldKey.limit))
    .positive(messages.invalid(fieldKey.limit))
    .optional(),
  image: z
    .string()
    .transform((value) => (value ? value.trim() : undefined))
    .optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
