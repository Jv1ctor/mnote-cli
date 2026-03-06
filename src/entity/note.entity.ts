export class Note {
  public title!: string
  public contents!: Map<number, string>

  toStringContents() {
    let text = ""
    this.contents.forEach((it) => (text += it + "\n"))
    return text
  }

  toString() {
    return this.title + "\n" + this.toStringContents()
  }
}
