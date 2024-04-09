# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## v2.1.2

[compare changes](https://github.com/unjs/rc9/compare/v2.1.1...v2.1.2)

### 🩹 Fixes

- Stringify strings to avoid being cast to numbers ([#123](https://github.com/unjs/rc9/pull/123))
- **parse:** Handle empty values ([#86](https://github.com/unjs/rc9/pull/86))

### 🏡 Chore

- Update repo ([86d3590](https://github.com/unjs/rc9/commit/86d3590))
- Update readme ([#113](https://github.com/unjs/rc9/pull/113))
- Try tea.yaml ([701f71a](https://github.com/unjs/rc9/commit/701f71a))
- Upgrade `flat` to v6 and inline ([38cebbb](https://github.com/unjs/rc9/commit/38cebbb))
- Update badges ([14618f0](https://github.com/unjs/rc9/commit/14618f0))
- Update readme ([4766224](https://github.com/unjs/rc9/commit/4766224))
- Update lockfile ([fcb4059](https://github.com/unjs/rc9/commit/fcb4059))
- Lint ([07df4c9](https://github.com/unjs/rc9/commit/07df4c9))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Huel129 ([@vue-multiple](http://github.com/vue-multiple))
- Nozomu Ikuta ([@NozomuIkuta](http://github.com/NozomuIkuta))
- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v2.1.1

[compare changes](https://github.com/unjs/rc9/compare/v2.1.0...v2.1.1)


### 🏡 Chore

  - Update badge link ([#76](https://github.com/unjs/rc9/pull/76))
  - Update dev dependencies ([88f6b2a](https://github.com/unjs/rc9/commit/88f6b2a))
  - Update destr to v2 ([7c846b6](https://github.com/unjs/rc9/commit/7c846b6))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Renato Lacerda <renato.ac.lacerda@gmail.com>

## v2.1.0

[compare changes](https://github.com/unjs/rc9/compare/v2.0.1...v2.1.0)


### 🚀 Enhancements

  - Support type generics ([44bac23](https://github.com/unjs/rc9/commit/44bac23))

### 🏡 Chore

  - Update dev dependencies ([918e4f7](https://github.com/unjs/rc9/commit/918e4f7))
  - Update release script ([87ee206](https://github.com/unjs/rc9/commit/87ee206))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v2.0.1

[compare changes](https://github.com/unjs/rc9/compare/v1.2.4...v2.0.1)


### 🩹 Fixes

  - Use named export from defu ([b9401d1](https://github.com/unjs/rc9/commit/b9401d1))
  - Add type exports ([b64adaa](https://github.com/unjs/rc9/commit/b64adaa))

### 💅 Refactors

  - Update repository ([f76dd93](https://github.com/unjs/rc9/commit/f76dd93))

### 🏡 Chore

  - Update dependencies ([a9abe31](https://github.com/unjs/rc9/commit/a9abe31))
  - Fix type ([5e02ecf](https://github.com/unjs/rc9/commit/5e02ecf))
  - Update test scripts ([a31b8ab](https://github.com/unjs/rc9/commit/a31b8ab))
  - Update tsconfig ([8e3b33e](https://github.com/unjs/rc9/commit/8e3b33e))
  - **release:** 1.2.3 ([caaa52a](https://github.com/unjs/rc9/commit/caaa52a))
  - **release:** 2.0.0 ([d993e87](https://github.com/unjs/rc9/commit/d993e87))
  - **release:** 1.2.4 ([a24a252](https://github.com/unjs/rc9/commit/a24a252))
  - Update repo ([a8c95c5](https://github.com/unjs/rc9/commit/a8c95c5))

### ❤️  Contributors

- Pooya Parsa <pooya@pi0.io>

## [2.0.0](https://github.com/unjs/rc9/compare/v1.2.3...v2.0.0) (2022-11-15)

### [1.2.3](https://github.com/unjs/rc9/compare/v1.2.2...v1.2.3) (2022-11-15)

### [1.2.2](https://github.com/unjs/rc9/compare/v1.2.1...v1.2.2) (2022-04-07)


### Bug Fixes

* avoid optional chaining for node 12.x compatibility ([a4349ab](https://github.com/unjs/rc9/commit/a4349ab85606e71b65e6a4df70dc889d26223efd))

### [1.2.1](https://github.com/unjs/rc9/compare/v1.2.0...v1.2.1) (2022-04-07)


### Bug Fixes

* use `XDG_CONFIG_HOME` for `writeUser` and `updateUser` ([5c1f7a9](https://github.com/unjs/rc9/commit/5c1f7a9873302b9ae04bf2eb979a315caaa4ce96))

## [1.2.0](https://github.com/unjs/rc9/compare/v1.1.0...v1.2.0) (2020-11-25)


### Features

* support `XDG_CONFIG_HOME` (closes [#1](https://github.com/unjs/rc9/issues/1)) ([2792d9b](https://github.com/unjs/rc9/commit/2792d9b93d16771425a56a0166e3d2a3cac3fa34))

## [1.1.0](https://github.com/unjs/rc9/compare/v1.0.0...v1.1.0) (2020-11-09)


### Features

* support array push syntax ([6d1ff0d](https://github.com/unjs/rc9/commit/6d1ff0dff0dfb4fa94b3687f91a8b629c020ed54))

## [1.0.0](https://github.com/unjs/rc9/compare/v0.0.7...v1.0.0) (2020-06-16)

### [0.0.7](https://github.com/unjs/rc9/compare/v0.0.6...v0.0.7) (2020-05-28)


### Bug Fixes

* set `sideEffects` field in package.json to allow tree-shaking ([c8fc9cc](https://github.com/unjs/rc9/commit/c8fc9ccc8eeffe70f5cf6d8ae832989c9ce3bdb4))

### [0.0.6](https://github.com/unjs/rc9/compare/v0.0.5...v0.0.6) (2020-05-28)

### [0.0.5](https://github.com/unjs/rc9/compare/v0.0.4...v0.0.5) (2020-05-28)

### [0.0.4](https://github.com/unjs/rc9/compare/v0.0.3...v0.0.4) (2020-05-28)

### [0.0.3](https://github.com/unjs/rc9/compare/v0.0.2...v0.0.3) (2020-05-28)


### Features

* update() and improvements ([69539be](https://github.com/unjs/rc9/commit/69539bed862cf5659971329d2007e78d97bcd2a4))

### [0.0.2](https://github.com/unjs/rc9/compare/v0.0.1...v0.0.2) (2020-05-27)


### Features

* support directly passing name as options ([e493cdf](https://github.com/unjs/rc9/commit/e493cdf8fda7bda4eb2b95148485d8a008feff4c))


### Bug Fixes

* allow more characters for key ([9557009](https://github.com/unjs/rc9/commit/955700996ff0b9f3c34135adb42146d718df83a7))
* pass encoding to writeFileSync ([59c937a](https://github.com/unjs/rc9/commit/59c937a9a434e28d9e083db66b552383b61a975f))

### 0.0.1 (2020-05-27)
