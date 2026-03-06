import type { Note } from "../entity/note.entity";
import type { OptionsUpdate } from "../types/options-update.types";


export interface IVaultRepository {
  create(note: Note): Promise<void>
  read(path: string): Promise<string>
  listAll(path?: string): Promise<string[]>
  update(note: Note, options?: OptionsUpdate): Promise<void>
}