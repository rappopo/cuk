'use strict'

module.exports = function(cuk) {
  const { _, fs, path } = cuk.lib

  return (dir, file) => {
    if (fs.existsSync(path.join(dir, `${file}.js`)))
      return require(path.join(dir, `${file}.js`))(cuk)
    return new Promise((resolve, reject) => {
      if (fs.existsSync(path.join(dir, `${file}.json`))) {
        try {
          resolve(require(path.join(dir, `${file}.json`)))
        } catch(e) {
          resolve({})
        }
      } else {
        resolve({})
      }
    })
  }
}