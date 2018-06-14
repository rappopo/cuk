'use strict'

module.exports = function(cuk) {
  return (dir, root, replacer = '.') => {
    root = root || cuk.dir.root
    dir = dir || ''
    let d = dir.replace(root, replacer)
    return d
  }
}