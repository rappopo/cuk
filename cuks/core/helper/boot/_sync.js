'use strict'

module.exports = function(cuk) {
  const { _, globby, path, fs } = cuk.pkg.core.lib
  const merge = require('../merge')(cuk)
  const trace = require('../trace')(cuk)
  const makeChoices = require('../make/choices')(cuk)

  const getHooks = (ns) => {
    let hooks = []
    _.forOwn(cuk.pkg, (p, k) => {
      const dir = path.join(p.dir, 'cuks', ns)
      const pattern = `${dir}/hook/*`
      const files = globby.sync(`${pattern}/*.js`, {
        ignore: [
          `${pattern}/_*`,
        ]
      })
      _.each(files, f => {
        let parts = f.split(path.sep),
          base = _.last(parts).replace('.js', '').split('_')
        hooks.push({
          from: p.id,
          pkgId: base[0],
          type: parts[parts.length - 2],
          key: _.camelCase(base.slice(1).join(' ')),
          file: f
        })
      })
    })
    return hooks
  }

  return (options) => {
    let { pkgId,
      name,
      action,
      createAppDir = true,
      createContainer = true,
      parentAction,
      deep = true,
      ext = '.js'
    } = options
    const exts = makeChoices(ext)
    let ns = !!name ? `${pkgId}/${name}` : pkgId
//    if (!name) createContainer = false
    if (createAppDir)
      fs.ensureDirSync(path.join(cuk.dir.app, 'cuks', ns))

    const hooks = getHooks(ns)
    let hook = _.filter(hooks, { pkgId: 'parent', type: 'before' })
    if (hook.length > 0) {
      if (process.env.VERBOSE) trace('|  |---> parentHook:before')
      _.each(hook, h => {
        let text = '|  |     |- %s'
        let result = require(h.file)(cuk)()
        if (result) text += ': ' + result
        if (process.env.VERBOSE) trace(text, h.from)
      })
    }

    _.forOwn(cuk.pkg, (p, k) => {
      if (createContainer) {
        p.cuks[pkgId] = name === '' ? {} : merge(p.cuks[pkgId], _.set({}, name, {}))
      }

      let dir = path.join(p.dir, 'cuks', ns)

      const pattern = deep ? '/**' : ''
      let ignore = [
        `${dir}/_*/**/*`,
        `${dir}/hook/**/*`,
      ], patterns = []
      _.each(exts, ext => {
        ignore.push(`${dir}${pattern}/_*${ext}`)
        patterns.push(`${dir}${pattern}/*${ext}`)
      })

      const files = globby.sync(patterns, {
        ignore: ignore
      })

      if (files.length > 0) {
        if (_.isFunction(parentAction)) {
          parentAction({
            pkg: p,
            dir: dir,
            files: files,
            name: name
          })
        }
        _.each(files, f => {
          const ext = path.extname(f),
            key = _.camelCase(f.replace(dir, '').replace(ext, ''))
          hook = _.filter(hooks, { pkgId: p.id, key: key, type: 'before' })
          if (hook.length > 0) {
            if (process.env.VERBOSE) trace('|  |  |---> hook:before')
            _.each(hook, h => {
              let text = '|  |  |     |- %s'
              let result = require(h.file)(cuk)()
              if (result) text += ' ⇒ ' + result
              if (process.env.VERBOSE) trace(text, h.from)
            })
          }
          if (_.isFunction(action)) {
            action({
              pkg: p,
              dir: dir,
              file: f,
              name: name,
              key: key
            })
          }
          hook = _.filter(hooks, { pkgId: p.id, key: key, type: 'after' })
          if (hook.length > 0) {
            if (process.env.VERBOSE) trace('|  |  |---> hook:after')
            _.each(hook, h => {
              let text = '|  |  |     |- %s'
              let result = require(h.file)(cuk)()
              if (result) text += ' => ' + result
              if (process.env.VERBOSE) trace(text, h.from)
            })
          }
        })
      }
    })
    hook = _.filter(hooks, { pkgId: 'parent', type: 'after' })
    if (hook.length > 0) {
      if (process.env.VERBOSE) trace('|  |---> parentHook:after')
      _.each(hook, h => {
        let text = '|  |     |- %s'
        let result = require(h.file)(cuk)()
        if (result) text += ': ' + result
        if (process.env.VERBOSE) trace(text, h.from)
      })
    }
  }
}
