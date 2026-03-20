import { Note } from "../../../entity/note.entity";
import type { IMapper } from "../../../interfaces/mapper.interface";
import type { OptionsDto } from "../dtos/options.dto"
import type { UpdateDto } from "../dtos/update.dto"

export class UpdateMapper implements IMapper<Note, UpdateDto, OptionsDto> {
  toDto(entity: Note, options: OptionsDto): UpdateDto {
    const contents: { line: number; body: string }[] = []
    entity.contents.forEach((it, idx) => contents.push({ line: idx, body: it }))

    return {
      note: {
        title: entity.title,
        contents: contents,
      },
      options,
    }
  }

  toEntity(dto: UpdateDto): Note {
    const entity = new Note()
    const map = new Map()
    dto.note.contents.forEach((it) => map.set(it.line, it.body))
    ;((entity.title = dto.note.title), (entity.contents = map))

    return entity
  }
}
