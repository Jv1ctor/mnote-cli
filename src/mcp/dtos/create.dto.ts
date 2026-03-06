import z from "zod"

export const CreateDto = z.object({
  title: z.string(),
  content: z.string(),
})

export type CreateDto = z.infer<typeof CreateDto>