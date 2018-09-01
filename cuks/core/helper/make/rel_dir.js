'use strict'

module.exports = function (cuk) {
  return (dir, app, replacer = '.') => {
    app = app || cuk.dir.app
    dir = dir || ''
    let d = dir.replace(app, replacer)
    return d
  }
}
