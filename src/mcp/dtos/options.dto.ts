import z from "zod"

export const OptionsDto = z.object({
  lineStart: z.number().optional(),
  lineEnd: z.number().optional(),
})

export type OptionsDto = z.infer<typeof OptionsDto>
