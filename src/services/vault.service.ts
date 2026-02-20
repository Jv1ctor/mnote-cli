import type { Note } from "../entity/note.entity"
import type { IVaultRepository } from "../interfaces/vault.interface"

export class VaultService {
  constructor(private repo: IVaultRepository) {}

  async create(note: Note) {
    await this.repo.create(note)
  }

  async read(name: string) {
    return this.repo.read(name)
  }

  async list(dirname?: string) {
    return this.repo.listAll(dirname)
  }
}
