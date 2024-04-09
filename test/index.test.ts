import { describe, test, expect } from "vitest";
import {
  write,
  read,
  readUser,
  parse,
  update,
  updateUser,
  writeUser,
} from "../src";

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
    writeUser(config);
    expect(readUser()).toMatchObject(config);
  });

  test("Read config", () => {
    expect(read(".conf")).toMatchObject(config);
  });

  test("Update user config", () => {
    updateUser({ "db.password": '"123"' });
    expect(readUser().db.password).toBe(`"123"`);
  });

  test("Update user config to empty string", () => {
    updateUser({ "db.password": "" });
    expect(readUser().db.password).toBe("");
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
