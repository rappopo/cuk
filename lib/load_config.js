'use strict'

module.exports = function(cuk, trace) {
  const { _, helper, path, globby } = cuk.pkg.core.lib

  const getHooks = () => {
    let hooks = []
    _.forOwn(cuk.pkg, (p, k) => {
      const dir = path.join(p.dir, 'config')
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

  const execHooks = (hooks, pkgId, type) => {
    return new Promise((resolve, reject) => {
      let hook = _.filter(hooks, { pkgId: pkgId, type: type })
      if (hook.length === 0) return resolve(true)
      trace(`%C parentHook:${type}`)
      Promise.map(hook, h => {
        let text = '%P %s'
        return new Promise((resv, rejc) => {
          require(h.file)(cuk)
          .then(result => {
            if (result && _.isString(result) && !_.isEmpty(result)) text += ': ' + result
            trace(text, null, h.from)
            resv(true)
          })
          .catch(rejc)
        })
      })
      .then(resolve).catch(reject)
    })
  }

  return new Promise((resolve, reject) => {
    let defCfg = {}
    trace('%Z Loading configurations...', null)

    const hooks = getHooks()

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
        cfg.common = cfg.common || {}
        cfg.common.mount = cfg.common.mount || ('/' + p.id)
        cfg.cuks = cfg.cuks || {}
        cuk.pkg[p.id].cfg = cfg
      })
      return Promise.resolve(true)
    })
    .then(() => {
      return execHooks(hooks, 'parent', 'after')
    })
    .then(resolve).catch(reject)
  })
}