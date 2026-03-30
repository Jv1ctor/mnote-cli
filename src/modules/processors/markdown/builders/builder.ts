import type { Default } from "../schemas/default"
import type { Heading } from "../types/heading.type"
import type { Root } from "../types/root.type"
import type { IBuilder } from "./interfaces/builder.interfaces"

type ObjectEntry<R> = {
  nodeIndex: number
  depth: number
  object: Default<R>
}

export abstract class Builder<T> implements IBuilder<T> {
  protected root: Root
  protected collectionsHeadings: Default<T>[] = []
  protected result: Default<T>[] = []
  protected stack: Default<T>[] = []
  protected entries: ObjectEntry<T>[] = []

  protected extractText(node: unknown): string {
    if (!node || typeof node !== "object") {
      return ""
    }

    const n = node as {
      value?: unknown
      children?: unknown[]
    }

    if (typeof n.value === "string") {
      return n.value
    }

    if (Array.isArray(n.children)) {
      return n.children.map((child) => this.extractText(child)).join("")
    }

    return ""
  }

  protected buildTitle(heading: Heading): string {
    const title = heading.children
      .map((child) => this.extractText(child))
      .join("")
      .trim()
    return title
  }

  protected buildId(heading: Heading, fallbackSeed: string): string {
    const offsetStart = heading.position?.start.offset ?? 0
    const offsetEnd = heading.position?.end.offset ?? offsetStart
    const position = `${offsetStart}-${offsetEnd}`
    const title = this.buildTitle(heading)
    const hashSource = `${title}:${position}:${fallbackSeed}`

    return `${Bun.hash(hashSource).toString()}-${position}`
  }

  abstract buildObject(heading: Heading, index: number): Default<T>

  public reset(ast: Root): void {
    this.root = ast
    this.collectionsHeadings = []
    this.result = []
    this.stack = []
    this.entries = []
  }

  public collectHeadings(): void {
    let headingIndex = 0

    for (const [nodeIndex, struct] of this.root.children.entries()) {
      if (struct.type === "heading") {
        const object = this.buildObject(struct, headingIndex)

        this.collectionsHeadings.push(object)
        this.entries.push({
          nodeIndex,
          depth: struct.depth,
          object,
        })

        headingIndex += 1
      }
    }
  }

  public linkHierarchy(): void {
    for (const object of this.collectionsHeadings) {
      while (this.stack.length > 0) {
        const top = this.stack[this.stack.length - 1]
        if (!top || top.depth < object.depth) {
          break
        }

        this.stack.pop()
      }

      const parent = this.stack[this.stack.length - 1]
      if (parent) {
        object.parentId = parent.id
        parent.children.push(object as T)
      } else {
        this.result.push(object)
      }

      this.stack.push(object)
    }
  }

  public assignContent(): void {}

  public getResult(): T[] {
    return this.result as T[]
  }

}
