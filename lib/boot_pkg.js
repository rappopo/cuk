'use strict'

module.exports = function(cuk) {
  const { path, fs, helper } = cuk.lib
  const trace = helper('core:bootTrace')

  return pkg => {
    return new Promise((resolve, reject) => {
      const bootFile = path.join(pkg.dir, 'boot.js'),
        beforeBootFile = path.join(pkg.dir, 'boot_before.js'),
        afterBootFile = path.join(pkg.dir, 'boot_after.js')
      if (!fs.existsSync(bootFile)) return resolve(true)
      Promise.resolve(true)
      .then(result => {
        if (!fs.existsSync(beforeBootFile)) return Promise.resolve(true)
        trace('%C Before booting cuk:%s...', null, pkg.id)
        return require(beforeBootFile)(cuk)
      })
      .then(result => {
        trace('%Z Booting cuk:%s now...', null, pkg.id)
        return require(bootFile)(cuk)
      })
      .then(result => {
        if (!fs.existsSync(afterBootFile)) return Promise.resolve(true)
        trace('%C After booting cuk:%s...', null, pkg.id)
        return require(afterBootFile)(cuk)
      })
      .then(result => {
        resolve(true)
      })
      .catch(err => {
        resolve(true)
      })
    })
  }
}