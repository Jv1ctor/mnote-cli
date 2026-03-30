import type { Root } from "../../types/root.type";



export interface IBuilder<T> {
  reset(ast: Root): void
  collectHeadings(): void
  linkHierarchy(): void
  assignContent(): void
  getResult(): T[]
}