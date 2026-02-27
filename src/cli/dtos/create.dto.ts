import { Note } from "../../entity/note.entity"

export class CreateDto {
  constructor(
    public title: string,
    public content: string,
  ) {}

  fromEntity() {
    const note = new Note()
    note.title = this.title
    note.content = this.content

    return note
  }
}
