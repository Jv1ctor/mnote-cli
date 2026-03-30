import remarkParse from "remark-parse"
import { unified } from "unified"
import { Director } from "./director"
import { OutlineBuilder } from "./builders/outline.builder"
import { SectionBuilder } from "./builders/section.builder"
import type { Outline } from "./schemas/outline"
import type { Section } from "./schemas/section"

export class MarkdownProcessor {
  public async toTree(data: string) {
    const astmd = unified().use(remarkParse).parse(data)

    const director = new Director(astmd)

    const outlineBuilder = new OutlineBuilder()
    const sectionBuilder = new SectionBuilder()

    const outline = director.construct<Outline>(outlineBuilder)
    const section = director.construct<Section>(sectionBuilder)

    console.log(JSON.stringify(section, null, 2))
    return { outline, section }
  }
}
