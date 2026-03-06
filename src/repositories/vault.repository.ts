import { Note } from "../entity/note.entity"
import type { IVaultRepository } from "../interfaces/vault-repository.interface"
import { readdir } from "node:fs/promises"
import { join } from "path"
import type { OptionsUpdate } from "../types/options-update.types"
import { NoteMapper } from "../mappers/note.mapper"

export class VaultRepository implements IVaultRepository {
  constructor(private path: string) {}

  async create(note: Note): Promise<void> {
    const file = Bun.file(join(this.path, `${note.title}.md`))

    await file.write(note.toStringContents())
  }

  async read(name: string): Promise<string> {
    const file = Bun.file(join(this.path, `${name}.md`))

    return file.text()
  }

  async listAll(dirname?: string): Promise<string[]> {
    const dirList = await readdir(join(this.path, dirname ?? ""))

    const filteredList = dirList.filter(
      (it) => !it.startsWith(".") || it.endsWith(".md"),
    )

    return filteredList
  }

  async update(note: Note, options: OptionsUpdate): Promise<void> {
    if (options.lineStart && options.lineEnd) {
      const content = await this.read(note.title)
      const arr = content.split("\n")

      for (let i = options.lineStart; i <= options.lineEnd; i++) {
        const text = note.contents.get(i)
        if (text !== undefined) {
          arr[i - 1] = text
        }
      }

      const newNote = new NoteMapper().toEntity({
        title: note.title,
        content: arr,
      })

      await this.create(newNote)
    }
  }
}
