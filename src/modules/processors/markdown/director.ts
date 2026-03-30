import type { Builder } from "./builders/builder"
import type { Root } from "./types/root.type"

export class Director {
  constructor(private ast: Root) {}

  public construct<T>(builder: Builder<T>) {
    builder.reset(this.ast)
    builder.collectHeadings()
    builder.linkHierarchy()
    builder.assignContent()

    return builder.getResult()
  }
}
