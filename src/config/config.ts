import { join } from "path"
import os from "os"
import type { ConfigJsonSchema } from "./schema/config-json.schema"

const root = process.cwd()
const homeDir = os.homedir()

export class Config {
  private dir: string = Bun.env.NODE_ENV === "development" ? root : homeDir
  private configDir = join(this.dir, ".mnote")
  private config = join(this.configDir, "config.json")

  async execute() {
    const file = Bun.file(this.config)

    if(!file)
      await Bun.write(this.config, "{}")
  }

  async savePath(path: string) {
    try {
      const data = { path }
      await Bun.write(this.config, JSON.stringify(data) || "")
    } catch (error) {
      console.log("Failed to write in config file")
    }
  }

  async getPath() {
    try {
      const data = await Bun.file(this.config).text()
      const config = JSON.parse(data) as ConfigJsonSchema
      return config.path
    } catch (error) {
      console.log("Failed to read config file")
    }
  }
}
