'use strict'

const chai = require('chai'),
  expect = chai.expect,
  chaiSubset = require('chai-subset'),
  path = require('path')

chai.use(chaiSubset)

const boot = require('../boot')
let helper, cuk

before(async function() {
  cuk = await boot()
  helper = cuk.pkg.core.lib.helper
})

describe('Helpers', function() {
  describe('core:configLoad', function() {
    const dir = path.join(process.cwd(), 'test', '_dir')

    it('should return empty object if file doesn\'t exists', async function() {
      let cfg = await helper('core:configLoad')(dir, 'not-exists')
      expect(cfg).to.be.an('object').that.is.empty
    })

    it('should return empty object if folder doesn\'t exists', async function() {
      let cfg = await helper('core:configLoad')(dir, 'config')
      expect(cfg).to.be.an('object').that.is.empty
    })

    it('should return the value of config.json if file is missing', async function() {
      let value = require('./_dir/cfg/config.json')
      let cfg = await helper('core:configLoad')(dir + '/cfg')
      expect(cfg).to.eql(value)
    })

    it('should return the value of config-alt.js because *.js has higher priority than *.json', async function() {
      let value = await require('./_dir/cfg/config-alt.js')(cuk)
      let cfg = await helper('core:configLoad')(dir + '/cfg', 'config-alt')
      expect(cfg).to.eql(value)
    })

    it('should return the value of index.json inside a config-dir folder', async function() {
      let value = require('./_dir/cfg/config-dir/index.json')
      let cfg = await helper('core:configLoad')(dir + '/cfg', 'config-dir')
      expect(cfg).to.eql(value)
    })

    it('should return the value of index.js because *.js has higher priority than *.json, even in a config-dir folder', async function() {
      let value = await require('./_dir/cfg/config-dir1/index.js')(cuk)
      let cfg = await helper('core:configLoad')(dir + '/cfg', 'config-dir1')
      expect(cfg).to.eql(value)
    })
  })

  describe('core:pkgs', function() {
    it('should return all loaded packages', async function() {
      const original = cuk.pkg
      let pkgs = await helper('core:pkgs')()
      expect(pkgs).is.an('array').that.has.length(1)
      expect(pkgs[0]).has.property('id', 'core')
    })

    it('should return empty packages', async function() {
      const original = cuk.pkg
      let pkgs = await helper('core:pkgs')({ id: 'non-existence'})
      expect(pkgs).is.an('array').that.has.length(0)
    })

    it('should return filtered packages', async function() {
      const original = cuk.pkg
      let pkgs = await helper('core:pkgs')({ id: 'core'})
      expect(pkgs).is.an('array').that.has.length(1)
      expect(pkgs[0]).has.property('id', 'core')
    })

  })

  describe('core:pkg', function() {
    it('should return null for an unknown id', async function() {
      let pkg = await helper('core:pkg')('non-existence')
      expect(pkg).to.be.a('null')
    })

    it('should return correct package for a valid id', async function() {
      let pkg = await helper('core:pkg')('core')
      expect(pkg).is.an('object').that.has.property('id', 'core')
    })

  })

  describe('core:pkgByName', function() {
    it('should return null for an unknown name', async function() {
      let pkg = await helper('core:pkgByName')('non-existence')
      expect(pkg).to.be.a('null')
    })

    it('should return correct package for a valid name', async function() {
      let pkg = await helper('core:pkgByName')('@rappopo/cuk')
      expect(pkg).is.an('object').that.has.property('id', 'core')
    })

  })

  describe('core:pkgByDir', function() {
    it('should return null for an unknown directory', async function() {
      let pkg = await helper('core:pkgByDir')('/a/b/c')
      expect(pkg).to.be.a('null')
    })

    it('should return correct package for a valid dir', async function() {
      let pkg = await helper('core:pkgByDir')(process.cwd())
      expect(pkg).is.an('object').that.has.property('id', 'core')
    })

  })

})