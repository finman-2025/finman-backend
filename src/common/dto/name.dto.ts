import { z } from 'zod';

import { messages, fieldKey } from '../text';

export const nameSchema = z.coerce
  .string({ message: messages.invalid(fieldKey.name) })
  .trim();
