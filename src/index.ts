import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { homedir } from 'os'
import destr from 'destr'
import { flatten, unflatten } from 'flat'
import defu from 'defu'

const RE_KEY_VAL = /^\s*([^=\s]+)\s*=\s*(.*)?\s*$/
const RE_LINES = /\n|\r|\r\n/

type RC = Record<string, any>

interface RCOptions {
  name?: string,
  dir?: string,
  flat?: boolean
}

export const defaults: RCOptions = {
  name: '.conf',
  dir: process.cwd(),
  flat: false
}

function withDefaults (options?: RCOptions | string): RCOptions {
  if (typeof options === 'string') {
    options = { name: options }
  }
  return { ...defaults, ...options }
}

export function parse (contents: string, options?: RCOptions): RC {
  const config: RC = {}

  const lines = contents.split(RE_LINES)

  for (const line of lines) {
    const match = line.match(RE_KEY_VAL)
    if (!match) { continue }

    // Key
    const key = match[1]

    if (!key || key === '__proto__' || key === 'constructor') {
      continue
    }

    const val = destr(match[2].trim() /* val */)

    if (key.endsWith('[]')) {
      const nkey = key.substr(0, key.length - 2)
      config[nkey] = (config[nkey] || []).concat(val)
      continue
    }

    config[key] = val
  }

  return options?.flat ? config : unflatten(config, { overwrite: true })
}

export function parseFile (path: string, options?: RCOptions): RC {
  if (!existsSync(path)) {
    return {}
  }
  return parse(readFileSync(path, 'utf-8'), options)
}

export function read (options?: RCOptions| string): RC {
  options = withDefaults(options)
  return parseFile(resolve(options.dir!, options.name!), options)
}

export function readUser (options?: RCOptions | string): RC {
  options = withDefaults(options)
  options.dir = process.env.XDG_CONFIG_HOME || homedir()
  return read(options)
}

export function serialize (config: RC): string {
  return Object.entries(flatten(config))
    .map(([key, val]) => `${key}=${typeof val === 'string' ? val : JSON.stringify(val)}`)
    .join('\n')
}

export function write (config: RC, options?: RCOptions | string) {
  options = withDefaults(options)
  writeFileSync(resolve(options.dir!, options.name!), serialize(config), {
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
  if (!options.flat) {
    config = unflatten(config, { overwrite: true })
  }
  const newConfig = defu(config, read(options))
  write(newConfig, options)
  return newConfig
}

export function updateUser (config: RC, options?: RCOptions | string): RC {
  options = withDefaults(options)
  options.dir = homedir()
  return update(config, options)
}
