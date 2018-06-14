'use strict'

module.exports = function(cuk) {
  const { _, globby, path, fs } = cuk.lib
  const merge = require('../merge')(cuk)

  return {
    boot: (options) => {
      let { pkgId, name, action, createRootDir = true, createContainer = true, rootAction, deep = true } = options
      let ns = !!name ? `${pkgId}/${name}` : pkgId
      if (!name) createContainer = false
      if (createRootDir)
        fs.ensureDirSync(path.join(cuk.dir.root, 'cuks', ns))

      _.forOwn(cuk.pkg, (p, k) => {
        if (createContainer) {
          p.cuks[pkgId] = merge(p.cuks[pkgId], _.set({}, name, {}))
        }

        let dir = path.join(p.dir, 'cuks', ns)
        const pattern = deep ? '/**' : '/*'
        var files = globby.sync(`${dir}${pattern}/*.js`, {
          ignore: [`${dir}${pattern}/_*.js`]
        })

        if (files.length > 0) {
          if (_.isFunction(rootAction)) {
            rootAction({
              pkg: p,
              dir: dir,
              files: files,
              name: name
            })
          }
          _.each(files, f => {
            let key = _.camelCase(f.replace(dir, '').replace('.js', '')),
              value = require(f)(cuk)
            if (_.isFunction(action))
              action({
                pkg: p,
                dir: dir,
                file: f,
                name: name,
                key: key,
                value: value
              })
          })
        }
      })
    }
  }
}
