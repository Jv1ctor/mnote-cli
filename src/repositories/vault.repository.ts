import type { Note } from "../entity/note.entity"
import type { IVaultRepository } from "../interfaces/vault.interface"
import { readdir } from "node:fs/promises"
import { join } from "path"

export class VaultRepository implements IVaultRepository {
  constructor(private path: string) {}

  async create(note: Note): Promise<void> {
    const file = Bun.file(join(this.path, `${note.title}.md`))

    await file.write(note.content)
  }

  async read(name: string): Promise<string> {
    const file = Bun.file(join(this.path, `${name}.md`))

    return file.text()
  }

  async listAll(dirname?: string): Promise<string[]> {
    const dirList = await readdir(join(this.path, dirname ?? ""))

    const filteredList = dirList.filter( (it) => !it.startsWith('.') || it.endsWith('.md'))

    return filteredList
  }

  async update(note: Note): Promise<void> {
    await this.create(note)
  }
}
