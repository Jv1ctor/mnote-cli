#!/usr/bin/env bun

import { cli } from "./cli/cli";
import { Config } from "./config/config";


const run = async () => {
  const config = new Config()
  await config.execute()

  cli(config)
}

run()