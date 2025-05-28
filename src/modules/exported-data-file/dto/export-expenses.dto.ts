import { z } from 'zod';

import { messages, fieldKey, responseMessage } from 'src/common/text';

export const exportExpensesSchema = z.object({
    startDate: z
        .string()
        .date(messages.invalid(fieldKey.date))
        .transform((value) => new Date(value)),
    endDate: z
        .string()
        .date(messages.invalid(fieldKey.date))
        .transform((value) => new Date(value)),
    fileType: z.enum(['csv', 'pdf']).optional().default('csv'),
})
  .refine(
    ({ startDate, endDate }) => (!startDate && !endDate) || startDate < endDate,
    { message: responseMessage.startDateBeforeEndDate },
  );;

export type ExportExpensesDto = z.infer<typeof exportExpensesSchema>;