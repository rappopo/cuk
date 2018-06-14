'use strict'

module.exports = function(cuk) {
  const { path } = cuk.lib
  return Promise.resolve({
    id: 'core',
    tag: 'boot',
    level: 0
  })
}