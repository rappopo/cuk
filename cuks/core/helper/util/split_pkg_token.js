'use strict'

module.exports = function(cuk) {
  const { util, helper } = cuk.pkg.core.lib

  return (name, pattern = 'Invalid name (%s)') => {
    let names = (name || '').split(':')
    if (names.length !== 2) throw new Error(util.format(pattern, name))
    const pkg = helper('core:pkg')(names[0])
    if (!pkg) throw new Error(util.format(pattern, name))
    return names
  }
}