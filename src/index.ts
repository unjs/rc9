import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { homedir } from 'os'
import destr from 'destr'
import f from 'flat'
import defu from 'defu'

const RE_KEY_VAL = /^\s*([^=\s]+)\s*=\s*(.*)?\s*$/
const RE_LINES = /\n|\r|\r\n/

type RC = Record<string, any>

interface RCOptions {
  name?: string,
  dir?: string,
  unflatten?: boolean
}

export const defaults: RCOptions = {
  name: '.conf',
  dir: process.cwd(),
  unflatten: true
}

function withDefaults (options?: RCOptions | string): RCOptions {
  if (typeof options === 'string') {
    options = { name: options }
  }
  return { ...defaults, ...options }
}

export function parse (contents: string, unflatten: boolean = true): RC {
  const config: RC = {}

  const lines = contents.split(RE_LINES)

  for (const line of lines) {
    const match = line.match(RE_KEY_VAL)
    if (!match) { continue }

    // Key
    const key = match[1]
    if (!key || key === '__proto__' || key === 'constructor') { continue }
    config[key] = destr(match[2].trim() /* val */)
  }

  return unflatten ? f.unflatten(config, { overwrite: true }) : config
}

export function parseFile (path: string, unflatten: boolean = true): RC {
  if (!existsSync(path)) {
    return {}
  }
  return parse(readFileSync(path, 'utf-8'), unflatten)
}

export function read (options?: RCOptions| string): RC {
  options = withDefaults(options)
  return parseFile(resolve(options.dir!, options.name!), options.unflatten)
}

export function readUser (options?: RCOptions | string): RC {
  options = withDefaults(options)
  options.dir = homedir()
  return read(options)
}

export function serialize (config: RC, unflatten: boolean = true): string {
  return Object.entries(unflatten ? f.flatten(config) : config)
    .map(([key, val]) => `${key}=${typeof val === 'string' ? val : JSON.stringify(val)}`)
    .join('\n')
}

export function write (config: RC, options?: RCOptions | string) {
  options = withDefaults(options)
  writeFileSync(resolve(options.dir!, options.name!), serialize(config, options.unflatten), {
    encoding: 'utf-8'
  })
}

export function writeUser (config: RC, options?: RCOptions | string) {
  options = withDefaults(options)
  options.dir = homedir()
  write(config, options)
}

export function update (config: RC, options?: RCOptions | string): RC {
  options = withDefaults(options)
  if (options.unflatten) {
    config = f.unflatten(config, { overwrite: true })
  }
  const newConfig = defu(config, read(options))
  write(newConfig, options)
  return newConfig
}

export function updateUser (config: RC, options?: RCOptions | string) {
  options = withDefaults(options)
  options.dir = homedir()
  return update(config, options)
}
