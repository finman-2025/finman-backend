import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ message: messages.missing(fieldKey.password) })
    .nonempty(messages.missing(fieldKey.password)),
  newPassword: z
    .string({ message: messages.missing(fieldKey.password) })
    .nonempty(messages.missing(fieldKey.password)),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
