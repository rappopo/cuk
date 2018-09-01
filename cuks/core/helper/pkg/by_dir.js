'use strict'

module.exports = function (cuk) {
  const pkgs = require('../pkgs')(cuk)

  return (dir) => {
    let results = pkgs({ dir: dir })
    return results.length > 0 ? results[0] : null
  }
}
