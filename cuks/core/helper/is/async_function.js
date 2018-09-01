'use strict'

module.exports = function (cuk) {
  return func => {
    const string = func.toString().trim()
    return !!(
      string.match(/^async /) ||
      string.match(/return _ref[^.]*\.apply/)
    )
  }
}
