import { write, read, readUser, parse, update, updateUser, writeUser } from '../src'

jest.mock('os', () => ({
  homedir: () => __dirname
}))

const config = {
  db: {
    username: 'db username',
    password: 'db pass',
    enabled: false
  }
}

describe('rc', () => {
  test('Write config', () => {
    write(config)
    expect(read()).toMatchObject(config)
  })

  test('Write config (user)', () => {
    writeUser(config)
    expect(readUser()).toMatchObject(config)
  })

  test('Read config', () => {
    expect(read('.conf')).toMatchObject(config)
  })

  test('Update user config', () => {
    updateUser({ 'db.password': '"123"' })
    expect(readUser().db.password).toBe('123')
  })

  test('Parse ignore invalid lines', () => {
    expect(parse(`
      foo=bar
      __proto__=no
      # test
      bar = baz
    `)).toMatchObject({
      foo: 'bar',
      bar: 'baz'
    })
  })

  test('Ignore non-existent', () => {
    expect(read({ name: '.404' })).toMatchObject({})
  })

  test('Flat mode', () => {
    const obj = { x: 1, 'x.y': 2 }
    update(obj, { flat: true, name: '.conf2' })
    expect(read({ flat: true, name: '.conf2' })).toMatchObject(obj)
  })

  test('Parse indexless arrays', () => {
    expect(parse(`
      x.foo[]=A
      x.foo[]=B
    `)).toMatchObject({
      x: {
        foo: ['A', 'B']
      }
    })
  })
})
