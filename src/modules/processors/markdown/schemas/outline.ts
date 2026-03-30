import { Default } from "./default"
import type { Section } from "./section"

export class Outline extends Default<Outline> {
  static fromSection(section?: Section): Outline {
    const outline = new Outline()

    if (!section) {
      return outline
    }

    outline.id = section.id
    outline.title = section.title || ""
    outline.depth = section.depth
    outline.parentId = section.parentId
    outline.children =
      section.children.length > 0
        ? section.children.map(Outline.fromSection)
        : []

    return outline
  }
}
