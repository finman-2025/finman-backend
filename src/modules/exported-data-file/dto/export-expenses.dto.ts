import { z } from 'zod';

import { messages, fieldKey } from 'src/common/text';

export const exportExpensesSchema = z.object({
    startDate: z
        .date()
        .refine(date => date <= new Date(), {
            message: messages.invalid(fieldKey.date),
        }),
    endDate: z
        .date()
        .refine(date => date <= new Date(), {
            message: messages.invalid(fieldKey.date),
        }),
    fileType: z.enum(['csv', 'pdf']).optional().default('csv'),
});

export type ExportExpensesDto = z.infer<typeof exportExpensesSchema>;