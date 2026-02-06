import { describe, test, expect } from "vitest";
import {
  write,
  read,
  parse,
  update,
  readUserConfig,
  writeUserConfig,
  updateUserConfig,
} from "../src/index.ts";

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
