import { z } from 'zod';

import { messages, fieldKey } from '../text';

export const idSchema = z.coerce
  .number({
    message: messages.invalid(fieldKey.id),
  })
  .int();

export const optionalIdSchema = z.coerce
  .number({
    message: messages.invalid(fieldKey.id),
  })
  .int()
  .optional();
