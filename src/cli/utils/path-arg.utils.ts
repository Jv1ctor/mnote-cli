export function getPathArg(args: string[]) {
  const path = args.find((it) => it.startsWith("--vault-path="))?.split("=")[1]

  if (!path) {
    console.log("necessary config --vault-path or insert")
    return
  }

  return path
}
