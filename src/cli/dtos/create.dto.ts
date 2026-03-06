import { Note } from "../../entity/note.entity"

export class CreateDto {
  constructor(
    public title: string,
    public content: string,
  ) {}

  toEntity() {
    const note = new Note()
    const map = new Map()
    this.content.split("\n").forEach((it, idx) => map.set(idx, it))

    note.title = this.title
    note.contents = map

    return note
  }
}
