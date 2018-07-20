'use strict'

module.exports = function(cuk) {
  const { _, globby, path, fs } = cuk.pkg.core.lib
  const merge = require('../merge')(cuk)
  const trace = require('../trace')(cuk)
  const pkgs = require('../pkgs')(cuk)
  const makeChoices = require('../make/choices')(cuk)

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
    if (!name) createContainer = false
    if (createAppDir)
      fs.ensureDirSync(path.join(cuk.dir.app, 'cuks', ns))

    return new Promise((resolve, reject) => {
      const all = pkgs(),
        allKeys = _.map(all, 'id')
      Promise.map(all, p => {
        if (createContainer) {
          p.cuks[pkgId] = merge(p.cuks[pkgId], _.set({}, name, {}))
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

        return Promise.resolve(files)
      })
      .then(result => {
        return Promise.map(result, (files, i) => {
          if (files.length === 0 || !_.isFunction(parentAction)) return Promise.resolve(true)
          return parentAction({
            pkg: all[i],
            dir: path.join(all[i].dir, 'cuks', ns),
            files: files,
            name: name
          })
        })
        .then(() => {
          return Promise.map(result, (files, i) => {
            let dir = path.join(all[i].dir, 'cuks', ns)
            return Promise.map(files, f => {
              if (!_.isFunction(action)) return Promise.resolve(true)
              const ext = path.extname(f),
                key = _.camelCase(f.replace(dir, '').replace(ext, ''))
              return action({
                pkg: all[i],
                dir: dir,
                file: f,
                name: name,
                key: key
              })
            })
          })
          .then(() => {
            return Promise.resolve(true)
          })
        })
        .then(() => {
          return Promise.resolve(true)
        })
      })
      .then(() => {
        resolve(true)
      })
      .catch(reject)
    })
  }
}
