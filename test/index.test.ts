import { chmodSync, existsSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, test, expect, afterAll } from "vitest";
import {
  write,
  read,
  parse,
  update,
  readUserConfig,
  writeUserConfig,
  updateUserConfig,
  writeUser,
  updateUser,
} from "../src/index.ts";

afterAll(() => {
  rmSync(resolve(__dirname, ".tmp"), { recursive: true, force: true });
});

process.env.XDG_CONFIG_HOME = __dirname;

const config = {
  db: {
    username: "db username",
    password: "db pass",
    enabled: false,
  },
};

describe("rc", () => {
  test("Write config", () => {
    write(config);
    expect(read()).toMatchObject(config);
  });

  test("Write config (user)", () => {
    writeUserConfig(config);
    expect(readUserConfig()).toMatchObject(config);
  });

  test("Read config", () => {
    expect(read(".conf")).toMatchObject(config);
  });

  test("Update user config", () => {
    updateUserConfig({ "db.password": '"123"' });
    expect(readUserConfig().db.password).toBe(`"123"`);
  });

  test("Update user config to empty string", () => {
    updateUserConfig({ "db.password": "" });
    expect(readUserConfig().db.password).toBe("");
  });

  test("Write user config (config dir)", () => {
    writeUserConfig(config, ".conf-user");
    expect(readUserConfig(".conf-user")).toMatchObject(config);
  });

  test("Update user config (config dir)", () => {
    updateUserConfig({ "db.password": "updated" }, ".conf-user");
    expect(readUserConfig(".conf-user").db.password).toBe("updated");
  });

  test("Parse ignore invalid lines", () => {
    expect(
      parse(`
      foo=bar
      __proto__=no
      # test
      bar = baz
      empty =
    `),
    ).toMatchObject({
      foo: "bar",
      bar: "baz",
    });
  });

  test("Ignore non-existent", () => {
    expect(read({ name: ".404" })).toMatchObject({});
  });

  test("Flat mode", () => {
    const object = { x: 1, "x.y": 2 };
    update(object, { flat: true, name: ".conf2" });
    expect(read({ flat: true, name: ".conf2" })).toMatchObject(object);
  });

  test("Write config creates missing directories", () => {
    const dir = resolve(__dirname, ".tmp/nested/deeply");
    rmSync(dir, { recursive: true, force: true });
    expect(existsSync(dir)).toBe(false);
    write(config, { dir, name: ".conf" });
    expect(read({ dir, name: ".conf" })).toMatchObject(config);
  });

  test("Update user config creates missing directories", () => {
    const previousConfigHome = process.env.XDG_CONFIG_HOME;
    process.env.XDG_CONFIG_HOME = resolve(__dirname, ".tmp/xdg/nested");
    try {
      const dir = resolve(__dirname, ".tmp/xdg/nested");
      rmSync(dir, { recursive: true, force: true });
      expect(existsSync(dir)).toBe(false);
      updateUserConfig(config, ".conf-nested");
      expect(readUserConfig(".conf-nested")).toMatchObject(config);
    } finally {
      if (previousConfigHome === undefined) {
        delete process.env.XDG_CONFIG_HOME;
      } else {
        process.env.XDG_CONFIG_HOME = previousConfigHome;
      }
    }
  });

  test("Parse indexless arrays", () => {
    expect(
      parse(`
      x.foo[]=A
      x.foo[]=B
    `),
    ).toMatchObject({
      x: {
        foo: ["A", "B"],
      },
    });
  });
});

describe.skipIf(process.platform === "win32")("posix permissions", () => {
  const mode = (path: string) => statSync(path).mode & 0o777;

  const withConfigHome = (dir: string, fn: () => void) => {
    const previousConfigHome = process.env.XDG_CONFIG_HOME;
    process.env.XDG_CONFIG_HOME = dir;
    rmSync(dir, { recursive: true, force: true });
    try {
      fn();
    } finally {
      if (previousConfigHome === undefined) {
        delete process.env.XDG_CONFIG_HOME;
      } else {
        process.env.XDG_CONFIG_HOME = previousConfigHome;
      }
    }
  };

  for (const [name, writeConfig] of [
    ["writeUser", writeUser],
    ["writeUserConfig", writeUserConfig],
    ["updateUser", updateUser],
    ["updateUserConfig", updateUserConfig],
  ] as const) {
    test(`${name} creates private dir and file`, () => {
      const dir = resolve(__dirname, `.tmp/perms/${name}`);
      withConfigHome(dir, () => {
        writeConfig(config, ".conf");
        expect(mode(dir)).toBe(0o700);
        expect(mode(resolve(dir, ".conf"))).toBe(0o600);
      });
    });

    test(`${name} tightens permissions of an existing file`, () => {
      const dir = resolve(__dirname, `.tmp/perms-existing/${name}`);
      withConfigHome(dir, () => {
        write(config, { dir, name: ".conf" });
        chmodSync(resolve(dir, ".conf"), 0o644);
        writeConfig(config, ".conf");
        expect(mode(resolve(dir, ".conf"))).toBe(0o600);
      });
    });
  }

  test("write keeps default permissions", () => {
    const dir = resolve(__dirname, ".tmp/perms-generic");
    rmSync(dir, { recursive: true, force: true });
    write(config, { dir, name: ".conf" });
    const umask = process.umask();
    expect(mode(dir)).toBe(0o777 & ~umask);
    expect(mode(resolve(dir, ".conf"))).toBe(0o666 & ~umask);
  });
});
