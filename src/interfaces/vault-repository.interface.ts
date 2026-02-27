import type { Note } from "../entity/note.entity";


export interface IVaultRepository {
  create(note: Note): Promise<void>
  read(path: string): Promise<string>
  listAll(path?: string): Promise<string[]>
  update(note: Note): Promise<void>
}