import type { Note } from "../entity/note.entity"
import type { OptionsUpdate } from "../types/options-update.types"

export interface IVaultService {
  create(path: string, note: Note): Promise<void>
  read(path: string, name: string): Promise<string>
  list(path: string, dirname?: string): Promise<string[]>
  update(path: string, note: Note, options?: OptionsUpdate): Promise<void>
}
