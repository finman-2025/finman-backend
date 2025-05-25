import { z } from 'zod';

import { messages, fieldKey } from '../text';

export const idSchema = z.coerce
  .number({ message: messages.invalid(fieldKey.id) })
  .int(messages.invalid(fieldKey.id));

export const optionalIdSchema = z.coerce
  .number({ message: messages.invalid(fieldKey.id) })
  .int(messages.invalid(fieldKey.id))
  .optional();
