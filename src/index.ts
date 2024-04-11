import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { homedir } from "node:os";
import destr from "destr";
import { flatten, unflatten } from "flat";
import { defu } from "defu";

const RE_KEY_VAL = /^\s*([^\s=]+)\s*=\s*(.*)?\s*$/;
const RE_LINES = /\n|\r|\r\n/;

type RC = Record<string, any>;

interface RCOptions {
  /**
   * The name of the configuration file.
   * @optional
   */
  name?: string;

  /**
   * The directory where the configuration file is or should be written.
   * @optional
   */
  dir?: string;

  /**
   * Specifies whether the configuration should be treated as a flat object.
   * @optional
   */
  flat?: boolean;
}

/**
 * The default options for the configuration file.
 */
export const defaults: RCOptions = {
  name: ".conf",
  dir: process.cwd(),
  flat: false,
};

function withDefaults(options?: RCOptions | string): RCOptions {
  if (typeof options === "string") {
    options = { name: options };
  }
  return { ...defaults, ...options };
}

export function parse<T extends RC = RC>(
  contents: string,
  options: RCOptions = {},
): T {
  const config: RC = {};

  const lines = contents.split(RE_LINES);

  for (const line of lines) {
    const match = line.match(RE_KEY_VAL);
    if (!match) {
      continue;
    }

    // Key
    const key = match[1];

    if (!key || key === "__proto__" || key === "constructor") {
      continue;
    }

    const value = destr((match[2] || "").trim() /* val */);

    if (key.endsWith("[]")) {
      const nkey = key.slice(0, Math.max(0, key.length - 2));
      // eslint-disable-next-line unicorn/prefer-spread
      config[nkey] = (config[nkey] || []).concat(value);
      continue;
    }

    config[key] = value;
  }

  return options.flat ? (config as T) : unflatten(config, { overwrite: true });
}

/**
 * Parses a configuration string into an object.
 * @param {string} contents - The configuration data as a raw string.
 * @param {RCOptions} [options={}] - Options to control the parsing behaviour. See {@link RCOptions}.
 * @returns {RC} - The parsed configuration object. See {@link RC}.
 */
export function parseFile<T extends RC = RC>(
  path: string,
  options?: RCOptions,
): T {
  if (!existsSync(path)) {
    return {} as T;
  }
  return parse(readFileSync(path, "utf8"), options);
}

/**
 * Reads a configuration file from a default or specified location and parses its contents.
 * @param {RCOptions|string} [options] - Options for reading the configuration file, or the name of the configuration file. See {@link RCOptions}.
 * @returns {RC} - The parsed configuration object. See {@link RC}.
 */
export function read<T extends RC = RC>(options?: RCOptions | string): T {
  options = withDefaults(options);
  return parseFile(resolve(options.dir!, options.name!), options);
}

/**
 * Reads a custom configuration file from a default or specified location and parses its contents.
 * @param {RCOptions|string} [options] - Options for reading the configuration file, or the name of the configuration file. See {@link RCOptions}.
 * @returns {RC} - The parsed configuration object.
 */
export function readUser<T extends RC = RC>(options?: RCOptions | string): T {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  return read(options);
}

/**
 * Serialises a configuration object to a string format.
 * @param {RC} config - The configuration object to serialise. See {@link RC}.
 * @returns {string} - The serialised configuration string.
 */
export function serialize<T extends RC = RC>(config: T): string {
  return Object.entries(flatten<RC, RC>(config))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join("\n");
}

/**
 * Writes a configuration object to a file in a default or specified location.
 * @param {RC} config - The configuration object to write. See {@link RC}.
 * @param {RCOptions|string} [options] - Options for writing the configuration file, or the name of the configuration file. See {@link RCOptions}.
 */
export function write<T extends RC = RC>(
  config: T,
  options?: RCOptions | string,
) {
  options = withDefaults(options);
  writeFileSync(resolve(options.dir!, options.name!), serialize(config), {
    encoding: "utf8",
  });
}

/**
 * Writes a custom configuration object to a file in a default or specified location.
 * @param {RC} config - The configuration object to write. See {@link RC}.
 * @param {RCOptions|string} [options] - Options for writing the configuration file, or the name of the configuration file. See {@link RCOptions}.
 */
export function writeUser<T extends RC = RC>(
  config: T,
  options?: RCOptions | string,
) {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  write(config, options);
}

/**
 * Updates an existing configuration object by merging it with the contents of a configuration file and writing the result.
 * @param {RC} config - The configuration object to update. See {@link RC}.
 * @param {RCOptions|string} [options] - Options for updating the configuration file, or the name of the configuration file. See {@link RCOptions}.
 * @returns {RC} - The updated configuration object. See {@link RC}.
 */
export function update<T extends RC = RC>(
  config: T,
  options?: RCOptions | string,
): T {
  options = withDefaults(options);
  if (!options.flat) {
    config = unflatten(config, { overwrite: true });
  }
  const newConfig = defu(config, read(options));
  write(newConfig, options);
  return newConfig as T;
}

/**
 * Updates a custom configuration object by merging it with the contents of a configuration file in a default location and writing the result.
 * @param {RC} config - The configuration object to update. See {@link RC}.
 * @param {RCOptions|string} [options] - Options for updating the configuration file, or the name of the configuration file. See {@link RCOptions}.
 * @returns {RC} - The updated configuration object. See {@link RC}.
 */
export function updateUser<T extends RC = RC>(
  config: T,
  options?: RCOptions | string,
): T {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  return update(config, options);
}
