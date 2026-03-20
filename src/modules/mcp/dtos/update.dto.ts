import z from "zod"
import { OptionsDto } from "./options.dto"

export const UpdateDto = z.object({
  note: z.object({
    title: z.string(),
    contents: z.array(
      z.object({
        line: z.number(),
        body: z.string(),
      }),
    ),
  }),
  options: OptionsDto,
})

export type UpdateDto = z.infer<typeof UpdateDto>
