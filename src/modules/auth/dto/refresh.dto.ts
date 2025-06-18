import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const refreshSchema = z.object({
    refreshToken: z
        .string({ message: messages.missing(fieldKey.refreshToken) })
        .nonempty(messages.missing(fieldKey.refreshToken)),
});

export type RefreshDto = z.infer<typeof refreshSchema>;