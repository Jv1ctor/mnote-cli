import { resolvePath } from "../helpers/resolve-path.helpers"
import type { IVaultRepositoryFactory } from "../interfaces/vault-repository-factory.interface"
import type { IVaultRepository } from "../interfaces/vault-repository.interface"
import { VaultRepository } from "./vault.repository"

export class VaultRepositoryFactory implements IVaultRepositoryFactory {
  create(path: string): IVaultRepository {
    const resolvedPath = resolvePath(path)
    return new VaultRepository(resolvedPath)
  }
}
