import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { homedir } from 'os'
import destr from 'destr'
import flat from 'flat'

const RE_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/
const RE_LINES = /\n|\r|\r\n/

type RC = { [key: string]: any }

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

function withDefaults (options?: RCOptions): RCOptions {
  return { ...defaults, ...options }
}

/**
 * Parse rc contents
 */
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

  return unflatten ? flat.unflatten(config) : config
}

/**
 * Parse rc file
 */
export function parseFile (path: string, unflatten: boolean = true): RC {
  if (!existsSync(path)) {
    return {}
  }
  return parse(readFileSync(path, 'utf-8'), unflatten)
}

/**
 * Read rc file
 * @param name Name of rc file (default: '.conf')
 * @param dir Working directory (default: process.cwd())
 */
export function read (options?: RCOptions): RC {
  options = withDefaults(options)
  return parseFile(resolve(options.dir!, options.name!), options.unflatten)
}

/**
 * Read rc from user directory
 * @param name Name of rc file (default: '.conf')
 */
export function readUser (options?: RCOptions): RC {
  options = withDefaults(options)
  options.dir = homedir()
  return read(options)
}

/**
 * Serialize rc config
 * @param config Unflatten config
 */
export function serialize (config: RC, unflatten: boolean = true): string {
  return Object.entries(unflatten ? flat.flatten(config) : config)
    .map(([key, val]) => `${key}=${typeof val === 'string' ? val : JSON.stringify(val)}`)
    .join('\n')
}

/**
 * Write rc config
 * @param config Unflatten config
 * @param name Name of rc file (default: '.conf')
 * @param dir Working directory (default: process.cwd())
 */
export function write (config: RC, options?: RCOptions) {
  options = withDefaults(options)
  writeFileSync(resolve(options.dir!, options.name!), serialize(config, options.unflatten))
}

/**
 * Write rc from to user directory
 * @param name Name of rc file (default: '.conf')
 */
export function writeUser (config: RC, options?: RCOptions) {
  options = withDefaults(options)
  options.dir = homedir()
  write(config, options)
}
