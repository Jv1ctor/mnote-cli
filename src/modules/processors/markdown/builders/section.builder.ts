import { Section } from "../schemas/section"
import type { Block } from "../types/block.type"
import type { Heading } from "../types/heading.type"
import { Builder } from "./builder"

export class SectionBuilder extends Builder<Section> {
  private extractInlineMarkdown(node: unknown): string {
    if (!node || typeof node !== "object") {
      return ""
    }

    const n = node as {
      type?: unknown
      value?: unknown
      children?: unknown[]
      url?: unknown
      alt?: unknown
    }

    if (n.type === "inlineCode" && typeof n.value === "string") {
      return `\`${n.value}\``
    }

    if (n.type === "emphasis" && Array.isArray(n.children)) {
      return `*${n.children.map((child) => this.extractInlineMarkdown(child)).join("")}*`
    }

    if (n.type === "strong" && Array.isArray(n.children)) {
      return `**${n.children.map((child) => this.extractInlineMarkdown(child)).join("")}**`
    }

    if (n.type === "delete" && Array.isArray(n.children)) {
      return `~~${n.children.map((child) => this.extractInlineMarkdown(child)).join("")}~~`
    }

    if (n.type === "link") {
      const label = Array.isArray(n.children)
        ? n.children.map((child) => this.extractInlineMarkdown(child)).join("")
        : ""
      const href = typeof n.url === "string" ? n.url : ""
      return `[${label}](${href})`
    }

    if (n.type === "image") {
      const alt = typeof n.alt === "string" ? n.alt : ""
      const href = typeof n.url === "string" ? n.url : ""
      return `![${alt}](${href})`
    }

    if (n.type === "break") {
      return "  \n"
    }

    if (typeof n.value === "string") {
      return n.value
    }

    if (Array.isArray(n.children)) {
      return n.children
        .map((child) => this.extractInlineMarkdown(child))
        .join("")
    }

    return ""
  }

  private buildListItemMarkdown(item: unknown, marker: string): string {
    if (!item || typeof item !== "object") {
      return `${marker}`
    }

    const n = item as {
      children?: unknown[]
    }

    const blocks = Array.isArray(n.children) ? (n.children as Block[]) : []
    const renderedBlocks = blocks
      .map((block) => this.buildBlockMarkdown(block))
      .map((content) => content.trim())
      .filter((content) => content.length > 0)

    if (renderedBlocks.length === 0) {
      return `${marker}`
    }

    const firstBlock = renderedBlocks[0]
    if (!firstBlock) {
      return `${marker}`
    }

    const firstBlockLines = firstBlock.split("\n")
    let itemMarkdown = `${marker} ${firstBlockLines[0]}`

    if (firstBlockLines.length > 1) {
      itemMarkdown += `\n${firstBlockLines
        .slice(1)
        .map((line) => `  ${line}`)
        .join("\n")}`
    }

    if (renderedBlocks.length > 1) {
      itemMarkdown += `\n${renderedBlocks
        .slice(1)
        .map((blockContent) =>
          blockContent
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n"),
        )
        .join("\n")}`
    }

    return itemMarkdown
  }

  private buildBlockMarkdown(block: Block): string {
    const n = block as {
      type?: unknown
      children?: unknown[]
      depth?: unknown
      lang?: unknown
      value?: unknown
      ordered?: unknown
      start?: unknown
    }

    if (n.type === "paragraph") {
      return Array.isArray(n.children)
        ? n.children
            .map((child) => this.extractInlineMarkdown(child))
            .join("")
            .trim()
        : ""
    }

    if (n.type === "heading") {
      const depth = typeof n.depth === "number" ? n.depth : 1
      const title = Array.isArray(n.children)
        ? n.children
            .map((child) => this.extractInlineMarkdown(child))
            .join("")
            .trim()
        : ""
      return `${"#".repeat(depth)} ${title}`.trim()
    }

    if (n.type === "code") {
      const lang = typeof n.lang === "string" ? n.lang : ""
      const value = typeof n.value === "string" ? n.value : ""
      return `\`\`\`${lang}\n${value}\n\`\`\``
    }

    if (n.type === "blockquote") {
      const quote = Array.isArray(n.children)
        ? n.children
            .map((child) => this.buildBlockMarkdown(child as Block))
            .filter((content) => content.length > 0)
            .join("\n\n")
        : ""

      return quote
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")
        .trim()
    }

    if (n.type === "list") {
      const ordered = n.ordered === true
      const start = typeof n.start === "number" ? n.start : 1
      const children = Array.isArray(n.children) ? n.children : []

      return children
        .map((item, itemIndex) => {
          const marker = ordered ? `${start + itemIndex}.` : "-"
          return this.buildListItemMarkdown(item, marker)
        })
        .join("\n")
        .trim()
    }

    if (n.type === "thematicBreak") {
      return "---"
    }

    if (n.type === "html") {
      return typeof n.value === "string" ? n.value.trim() : ""
    }

    return this.extractText(block).trim()
  }

  private buildContent(blocks: Block[]): string {
    return blocks
      .map((block) => this.buildBlockMarkdown(block))
      .map((content) => content.trim())
      .filter((content) => content.length > 0)
      .join("\n\n")
      .trim()
  }

  private getSectionBoundary(currentEntryIndex: number): number | null {
    const current = this.entries[currentEntryIndex]
    if (!current) {
      return null
    }

    for (let i = currentEntryIndex + 1; i < this.entries.length; i += 1) {
      const next = this.entries[i]
      if (next && next.depth === current.depth) {
        return next.nodeIndex
      }
    }

    return null
  }

  override buildObject(heading: Heading, index: number): Section {
    const section = new Section()
    section.title = this.buildTitle(heading)
    section.id = this.buildId(heading, String(index))
    section.depth = heading.depth
    section.content = ""
    section.children = []
    section.parentId = ""

    return section
  }

  override assignContent() {
    for (let i = 0; i < this.entries.length; i += 1) {
      const current = this.entries[i]
      if (!current) {
        continue
      }

      const boundary = this.getSectionBoundary(i)
      const endIndex = boundary ?? this.root.children.length
      const blocks = this.root.children.slice(
        current.nodeIndex + 1,
        endIndex,
      ) as Block[]

      if (!(current.object instanceof Section)) return

      current.object.content = this.buildContent(blocks)
    }
  }
}
