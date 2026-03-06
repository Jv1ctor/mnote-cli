import { Note } from "../entity/note.entity"
import type { IMapper } from "../interfaces/mapper.interface"

export class NoteMapper implements IMapper<
  Note,
  { title: string; content: string[] }
> {
  toDto(entity: Note): { title: string; content: string[] } {
    return {
      title: entity.title,
      content: entity.toStringContents().split("\n"),
    }
  }

  toEntity(dto: { title: string; content: string[] }): Note {
    const note = new Note()
    const map = new Map<number, string>()

    dto.content.forEach((it, idx) => map.set(idx, it))
    note.title = dto.title
    note.contents = map

    return note
  }
}
