import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { homedir } from "node:os";
import destr from "destr";
import { flatten, unflatten } from "flat";
import { defu } from "defu";

const RE_KEY_VAL = /^\s*([^\s=]+)\s*=\s*(.*)?\s*$/;
const RE_LINES = /\n|\r|\r\n/;

export type RC = Record<string, any>;

export interface RCOptions {
  name?: string;
  dir?: string;
  flat?: boolean;
}

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

export function parseFile<T extends RC = RC>(
  path: string,
  options?: RCOptions,
): T {
  if (!existsSync(path)) {
    return {} as T;
  }
  return parse(readFileSync(path, "utf8"), options);
}

export function read<T extends RC = RC>(options?: RCOptions | string): T {
  options = withDefaults(options);
  return parseFile(resolve(options.dir!, options.name!), options);
}

export function readUser<T extends RC = RC>(options?: RCOptions | string): T {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  return read(options);
}

export function serialize<T extends RC = RC>(config: T): string {
  return Object.entries(flatten<RC, RC>(config))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join("\n");
}

export function write<T extends RC = RC>(
  config: T,
  options?: RCOptions | string,
) {
  options = withDefaults(options);
  writeFileSync(resolve(options.dir!, options.name!), serialize(config), {
    encoding: "utf8",
  });
}

export function writeUser<T extends RC = RC>(
  config: T,
  options?: RCOptions | string,
) {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  write(config, options);
}

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

export function updateUser<T extends RC = RC>(
  config: T,
  options?: RCOptions | string,
): T {
  options = withDefaults(options);
  options.dir = process.env.XDG_CONFIG_HOME || homedir();
  return update(config, options);
}
