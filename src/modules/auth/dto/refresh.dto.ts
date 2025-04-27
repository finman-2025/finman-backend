import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const refreshSchema = z.object({
    username: z
        .string({ message: messages.missing(fieldKey.username) })
        .nonempty(messages.missing(fieldKey.username))
        .regex(/^[a-z0-9_]+$/i, { message: messages.invalid(fieldKey.username) })
        .toLowerCase(),
    refreshToken: z
        .string({ message: messages.missing(fieldKey.refreshToken) })
        .nonempty(messages.missing(fieldKey.refreshToken)),
});

export type RefreshDto = z.infer<typeof refreshSchema>;