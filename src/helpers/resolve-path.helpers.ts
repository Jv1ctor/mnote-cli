import { homedir } from "os"
import { join } from "path"

export function resolvePath(path: string) {
  if (path.startsWith("~")) {
    return join(homedir(), path.slice(1))
  }
  return path
}
