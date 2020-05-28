# RC**9**

> Read/Write RC files couldn't be easier!

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

## Install

Install using npm or yarn:

```bash
npm i rc9
# or
yarn add rc9
```

Import into your Node.js project:

```js
// CommonJS
const { read, write } = require('rc9')

// ESM
import { read, write } from 'rc9'
```

## Usage

`.conf`:

```ts
db.username=db username
db.password=db pass
db.enabled=true
```

**Read/Write config:**

```ts
const config = read() // or read('.conf')

// config = {
//   db: {
//     username: 'db username',
//     password: 'db pass',
//     enabled: true
//   }
// }

config.enabled = false
write(config) // or write(config, '.conf')
```

**Update config:**

```ts
update({ 'db.enabled': false })
```

### User Config

It is common to globally read/write config from/to user home directory, you can use `readUser`/`writeuser` shortcuts to quickly do this:

```js
writeUser({ token: 123 }, '.zoorc')

const conf = readUser('.zoorc') // { token: 123 }
```

## Unflatten

RC uses [flat](https://www.npmjs.com/package/flat) to automatically flat/unflat when writing and reading rcfile.

It means that you can use `.` for keys to define objects. Some examples:

- `hello.world = true` <=> `{ hello: { world: true }`
- `test.0 = A` <=> `tags: [ 'A' ]`

**Note:** If you use keys that can override like `x=` and `x.y=`, you can disable this feature by passing `flat: true` option.

## Native Values

RC uses [destr](https://www.npmjs.com/package/destr) to convert values into native javascript values.

So reading `count=123` results `{ count: 123 }` (instead of `{ count: "123" }`) if you want to preserve strings as is, can use `count="123"`.

## Exports

```ts
const defaults: RCOptions;
function parse(contents: string, flat: boolean): RC;
function parseFile(path: string, flat: boolean): RC;
function read(options?: RCOptions | string): RC;
function readUser(options?: RCOptions | string): RC;
function serialize(config: RC): string;
function write(config: RC, options?: RCOptions | string): void;
function writeUser(config: RC, options?: RCOptions | string): void;
function update(config: RC, options?: RCOptions | string): RC;
function updateUser(config: RC, options?: RCOptions | string): Record<string, any>;
```

**Defaults:**

```ts
{
  name: '.conf',
  dir: process.cwd(),
  flat: false
}
```

### Why RC**9**?

Be the first one to guess 🐇

## License

MIT. Made with 💖

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/rc9?style=flat-square
[npm-version-href]: https://npmjs.com/package/rc9

[npm-downloads-src]: https://img.shields.io/npm/dm/rc9?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/rc9

[github-actions-src]: https://img.shields.io/github/workflow/status/nuxt-contrib/rc9/ci/master?style=flat-square
[github-actions-href]: https://github.com/nuxt-contrib/rc9/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/gh/nuxt-contrib/rc9/master?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-contrib/rc9
