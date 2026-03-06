import { Note } from "../../entity/note.entity"
import type { IMapper } from "../../interfaces/mapper.interface"
import { CreateDto } from "../dtos/create.dto"

export class CreateMapper implements IMapper<Note, CreateDto, undefined> {
  public toEntity(dto: CreateDto): Note {
    const note = new Note()
    const map = new Map<number, string>()
    dto.content.split("\n").forEach((it, idx) => map.set(idx, it))

    note.title = dto.title
    note.contents = map

    return note
  }

  public toDto(entity: Note, _options?: undefined): CreateDto {
    const schema = CreateDto.parse(entity)
    return schema
  }
}
