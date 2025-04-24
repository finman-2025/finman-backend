import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

import { nameRegex, uppercaseFirstLetter } from 'src/common/utils';

export const createCategorySchema = z.object({
  name: z
    .string({ message: messages.missing(fieldKey.categoryName) })
    .nonempty(messages.missing(fieldKey.categoryName))
    .regex(nameRegex, { message: messages.invalid(fieldKey.categoryName) })
    .transform((value) => uppercaseFirstLetter(value.trim())),
  limit: z
    .number()
    .int(messages.invalid(fieldKey.limit))
    .positive(messages.invalid(fieldKey.limit))
    .optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
