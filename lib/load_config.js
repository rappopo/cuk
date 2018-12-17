'use strict'

module.exports = function (cuk, trace) {
  const { _, helper, path, globby } = cuk.pkg.core.lib

  const getHooks = () => {
    let hooks = []
    _.forOwn(cuk.pkg, (p, k) => {
      const dir = path.join(p.dir, 'config')
      const pattern = `${dir}/hook/*`
      const files = globby.sync(`${pattern}/*.js`, {
        ignore: [
          `${pattern}/_*`
        ]
      })
      _.each(files, f => {
        let parts = f.split(path.sep)
        let base = _.last(parts).replace('.js', '').split('_')
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

  const execHooksFile = (hook, text) => {
    return new Promise((resolve, reject) => {
      require(hook.file)(cuk)
        .then(result => {
          if (result && _.isString(result) && !_.isEmpty(result)) text += ': ' + result
          if (process.env.VERBOSE) trace(text, hook.from)
          resolve(true)
        })
        .catch(reject)
    })
  }

  const execHooks = (hooks, pkgId, type) => {
    return new Promise((resolve, reject) => {
      let hook = _.filter(hooks, { pkgId: pkgId, type: type })
      if (hook.length === 0) return resolve(true)
      if (process.env.VERBOSE) trace(`|---> parentHook:${type}`)
      Promise.map(hook, h => {
        let text = '|     |- %s'
        return execHooksFile(h, text)
      }).then(resolve).catch(reject)
    })
  }

  return new Promise((resolve, reject) => {
    let defCfg = {}
    trace('|= Loading configurations...')

    const hooks = getHooks()

    _.each(helper('core:pkgs')(), (p, i) => {
      cuk.pkg[p.id].cfg = {}
    })

    execHooks(hooks, 'parent', 'before')
      .then(() => {
        return Promise.map(helper('core:pkgs')(), p => {
          return helper('core:configLoad')(p.dir, 'config')
        })
      })
      .then(result => {
        defCfg = result
        return Promise.map(helper('core:pkgs')(), p => {
          let d = path.join(cuk.dir.data, 'config')
          return helper('core:configLoad')(d, p.id)
        })
      })
      .then(result => {
        _.each(helper('core:pkgs')(), (p, i) => {
          let cfg = helper('core:merge')(defCfg[i], result[i])
          cfg.mount = cfg.mount || ('/' + p.id)
          cfg.cuks = cfg.cuks || {}
          cuk.pkg[p.id].cfg = helper('core:merge')(cuk.pkg[p.id].cfg, cfg)
        })
        return Promise.resolve(true)
      })
      .then(() => {
        return execHooks(hooks, 'parent', 'after')
      })
      .then(resolve).catch(reject)
  })
}
