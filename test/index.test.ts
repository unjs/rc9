import flat from 'flat'
import { write, read, readUser, parse, updateUser } from '../src'

jest.mock('os', () => ({
  homedir: () => process.cwd()
}))

const config = {
  db: {
    username: 'db username',
    password: 'db pass',
    enabled: false
  }
}

const flatConfig: object = flat.flatten(config)

describe('rc', () => {
  test('Write config', () => {
    write(config)
  })

  test('Read config', () => {
    expect(read('.conf')).toMatchObject(config)
  })

  test('Read config (flat)', () => {
    expect(read({ unflatten: false })).toMatchObject(flatConfig)
  })

  test('Update user config', () => {
    updateUser({ 'db.password': '"123"' })
    expect(readUser().db.password).toBe('123')
  })

  test('Parse ignore invalid lines', () => {
    expect(parse(`
      foo=bar \n
      # test \n
      bar = baz
    `)).toMatchObject({
      foo: 'bar',
      bar: 'baz'
    })
  })

  test('Ignore non-existent', () => {
    expect(read({ name: '.404' })).toMatchObject({})
  })
})
