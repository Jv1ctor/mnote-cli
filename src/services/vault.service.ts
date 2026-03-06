import type { Note } from "../entity/note.entity"
import type { IVaultRepositoryFactory } from "../interfaces/vault-repository-factory.interface"
import type { IVaultService } from "../interfaces/vault-service.interface"
import type { OptionsUpdate } from "../types/options-update.types"

export class VaultService implements IVaultService {
  constructor(private repoFactory: IVaultRepositoryFactory) {}

  async create(path: string, note: Note) {
    const repo = this.repoFactory.create(path)
    await repo.create(note)
  }

  async read(path: string, name: string) {
    const repo = this.repoFactory.create(path)
    return repo.read(name)
  }

  async list(path: string, dirname?: string) {
    const repo = this.repoFactory.create(path)
    return repo.listAll(dirname)
  }

  async update(
    path: string,
    note: Note,
    options: OptionsUpdate,
  ): Promise<void> {
    const repo = this.repoFactory.create(path)
    await repo.update(note, options)
  }
}
