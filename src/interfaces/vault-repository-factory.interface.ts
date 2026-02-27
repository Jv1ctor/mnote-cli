import type { IVaultRepository } from "./vault-repository.interface"

export interface IVaultRepositoryFactory {
  create(path: string): IVaultRepository
}
