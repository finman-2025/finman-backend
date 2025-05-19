import { z } from 'zod';

import { messages, fieldKey } from '../text';
import { nameRegex } from '../utils';

export const typeSchema = z.coerce
  .string({ message: messages.invalid(fieldKey.type) })
  .regex(nameRegex, { message: messages.invalid(fieldKey.type) })
  .nonempty({ message: messages.missing(fieldKey.type) });
