import { z } from 'zod';

import { messages, fieldKey } from '../text';

export const dateSchema = z.coerce
  .string()
  .date(messages.invalid(fieldKey.date))
  .transform((value) => new Date(value));

export const optionalDateSchema = z.coerce
  .string()
  .date(messages.invalid(fieldKey.date))
  .transform((value) => new Date(value))
  .optional();
