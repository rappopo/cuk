'use strict'

module.exports = function(cuk) {
  const { _, globby, path, fs } = cuk.lib
  const merge = require('../merge')(cuk)
  const trace = require('./trace')(cuk)

  const getHooks = (ns) => {
    let hooks = []
    _.forOwn(cuk.pkg, (p, k) => {
      const dir = path.join(p.dir, 'cuks', ns)
      const pattern = `${dir}/_hook/*`
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

  return {
    boot: (options) => {
      let { pkgId, name, action, createAppDir = true, createContainer = true, parentAction, deep = true } = options
      let ns = !!name ? `${pkgId}/${name}` : pkgId
      if (!name) createContainer = false
      if (createAppDir)
        fs.ensureDirSync(path.join(cuk.dir.app, 'cuks', ns))

      const hooks = getHooks(ns)
      let hook = _.filter(hooks, { pkgId: 'parent', type: 'before' })
      if (hook.length > 0) {
        trace('%D parentHook:before')
        _.each(hook, h => {
          let text = '%F %s'
          let result = require(h.file)(cuk)()
          if (result) text += ': ' + result
          trace(text, null, h.from)
        })
      }

      _.forOwn(cuk.pkg, (p, k) => {
        if (createContainer) {
          p.cuks[pkgId] = merge(p.cuks[pkgId], _.set({}, name, {}))
        }

        let dir = path.join(p.dir, 'cuks', ns)

        const pattern = deep ? '/**' : ''
        const ignore = [
          `${dir}${pattern}/_*.js`,
          `${dir}/_*/**/*`,
        ]
        const files = globby.sync(`${dir}${pattern}/*.js`, {
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
            const key = _.camelCase(f.replace(dir, '').replace('.js', ''))
            hook = _.filter(hooks, { pkgId: p.id, key: key, type: 'before' })
            if (hook.length > 0) {
              trace('%D hook:before')
              _.each(hook, h => {
                let text = '%F %s'
                let result = require(h.file)(cuk)()
                if (result) text += ': ' + result
                trace(text, null, h.from)
              })
            }
            if (_.isFunction(action)) {
              action({
                pkg: p,
                dir: dir,
                file: f,
                name: name,
                key: key,
                value: require(f)(cuk)
              })
            }
            hook = _.filter(hooks, { pkgId: p.id, key: key, type: 'after' })
            if (hook.length > 0) {
              trace('%D hook:after')
              _.each(hook, h => {
                let text = '%F %s'
                let result = require(h.file)(cuk)()
                if (result) text += ': ' + result
                trace(text, null, h.from)
              })
            }
          })
        }
      })
      hook = _.filter(hooks, { pkgId: 'parent', type: 'after' })
      if (hook.length > 0) {
        trace('%D parentHook:after')
        _.each(hook, h => {
          let text = '%F %s'
          let result = require(h.file)(cuk)()
          if (result) text += ': ' + result
          trace(text, null, h.from)
        })
      }
    }
  }
}
