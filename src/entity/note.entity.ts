export class Note {
  public title: string
  public content: string

  fromString() {
    return this.title + "\n" + this.content
  }
}
