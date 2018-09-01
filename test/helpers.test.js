'use strict'

const path = require('path')

const boot = require('../boot')
let helper, cuk

beforeAll(() => {
  return boot({
    dir: {
      app: path.join(process.cwd(), 'test', 'dummy', 'app'),
      data: path.join(process.cwd(), 'test', 'dummy', 'data')
    }
  })
    .then(result => {
      cuk = result
      helper = cuk.pkg.core.lib.helper
    })
})

afterAll(() => {
  const { fs } = cuk.pkg.core.lib
  fs.emptyDir(path.join(process.cwd(), 'test', 'dummy', 'app'))
  fs.emptyDir(path.join(process.cwd(), 'test', 'dummy', 'data'))
})

describe('Helpers', function () {
  describe('core:configLoad', () => {
    const dir = path.join(process.cwd(), 'test', 'dummy', 'resource')

    test('Should return empty object if file doesn\'t exists', async () => {
      let cfg = await helper('core:configLoad')(dir, 'not-exists')
      expect(cfg).toEqual({})
    })

    test('Should return empty object if folder doesn\'t exists', async () => {
      let cfg = await helper('core:configLoad')('./non-exists', 'config')
      console.log(cfg)
      expect(cfg).toEqual({})
    })

    /*
    test('Should return the value of config.json if file is missing', async () => {
      let value = require(dir + '/config.json')
      let cfg = await helper('core:configLoad')(dir + '/cfg')
      expect(cfg).toEqual(value)
    })

    test('Should return the value of config-alt.js because *.js has higher priority than *.json', async () => {
      let value = await require(dir + '/config-alt.js')(cuk)
      let cfg = await helper('core:configLoad')(dir + '/cfg', 'config-alt')
      expect(cfg).toEqual(value)
    })

    test('Should return the value of index.json inside a config-dir folder', async () => {
      let value = require(dir + '/config-dir/index.json')
      let cfg = await helper('core:configLoad')(dir + '/cfg', 'config-dir')
      expect(cfg).toEqual(value)
    })

    test('Should return the value of index.js because *.js has higher priority than *.json, even in a config-dir folder', async () => {
      let value = await require(dir + '/config-dir1/index.js')(cuk)
      let cfg = await helper('core:configLoad')(dir + '/cfg', 'config-dir1')
      expect(cfg).toEqual(value)
    })
    */
  })

  /*

  describe('core:pkgs', function () {
    test('Should return all loaded packages', async () => {
      let pkgs = await helper('core:pkgs')()
      expect(pkgs).is.an('array').that.has.length(2)
      expect(pkgs[0]).has.property('id', 'core')
    })

    test('Should return empty packages', async () => {
      let pkgs = await helper('core:pkgs')({ id: 'non-existence' })
      expect(pkgs).is.an('array').that.has.length(0)
    })

    test('Should return filtered packages', async () => {
      let pkgs = await helper('core:pkgs')({ id: 'core' })
      expect(pkgs).is.an('array').that.has.length(1)
      expect(pkgs[0]).has.property('id', 'core')
    })
  })

  describe('core:pkg', function () {
    test('Should return null for an unknown id', async () => {
      let pkg = await helper('core:pkg')('non-existence')
      expect(pkg).to.be.a('null')
    })

    test('Should return correct package for a valid id', async () => {
      let pkg = await helper('core:pkg')('core')
      expect(pkg).is.an('object').that.has.property('id', 'core')
    })
  })

  describe('core:pkgByName', function () {
    test('Should return null for an unknown name', async () => {
      let pkg = await helper('core:pkgByName')('non-existence')
      expect(pkg).to.be.a('null')
    })

    test('Should return correct package for a valid name', async () => {
      let pkg = await helper('core:pkgByName')('@rappopo/cuk')
      expect(pkg).is.an('object').that.has.property('id', 'core')
    })
  })

  describe('core:pkgByDir', function () {
    test('Should return null for an unknown directory', async () => {
      let pkg = await helper('core:pkgByDir')('/a/b/c')
      expect(pkg).to.be.a('null')
    })

    test('Should return correct package for a valid dir', async () => {
      let pkg = await helper('core:pkgByDir')(process.cwd())
      expect(pkg).is.an('object').that.has.property('id', 'core')
    })
  })
  */
})
