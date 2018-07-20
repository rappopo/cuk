'use strict'

const { getInstalledPathSync } = require('get-installed-path')

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib

  return (name, cwd) => {
    try {
      let options = { local: true }
      if (cwd) options.cwd = cwd
      return getInstalledPathSync(name, options)
    } catch(e) {
      if (!cwd) throw e
      try {
        return getInstalledPathSync(name, { local: true })
      } catch(e) {
        throw e
      }
    }
  }
}