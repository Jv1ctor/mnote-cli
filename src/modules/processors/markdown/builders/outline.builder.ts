import { Outline } from "../schemas/outline"
import type { Heading } from "../types/heading.type"
import { Builder } from "./builder"

export class OutlineBuilder extends Builder<Outline> {
  override buildObject(heading: Heading, index: number): Outline {
    const outline = new Outline()
    outline.title = this.buildTitle(heading)
    outline.id = this.buildId(heading, String(index))
    outline.depth = heading.depth
    outline.children = []
    outline.parentId = ""

    return outline
  }
}
