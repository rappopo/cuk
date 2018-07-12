'use strict'

module.exports = function(cuk) {
  const { _, moment, helper } = cuk.pkg.core.lib

  return (unit, asSecond = false, asDuration = false) => {
    if (_.isNumber(unit)) return unit
    if (!_.isString(unit)) throw helper('core:makeError')('Only accept number or string')
    let supported = ('y,M,w,d,h,m,s,ms,q,years,months,weeks,days,hours,minutes,seconds,milliseconds,quarters,' +
      'year,month,week,day,hour,minute,second,millisecond,quarter').split(',')
    let parts = helper('core:makeChoices')(unit, ' ', text => text.toLowerCase())
    if (parts.length === 1) {
      let num = parseFloat(unit),
        numTxt = _.isNaN(num) ? '' : (num + ''),
        u = unit.replace(numTxt, '').toLowerCase()
      if (numTxt === '') throw helper('core:makeError')('Unparseable time')
      parts[0] = numTxt
      parts[1] = u
    }
    if (parts.length !== 2) throw helper('core:makeError')('Unparseable time')
    if (supported.indexOf(parts[1]) === -1) throw helper('core:makeError')('Unsupported unit of measurement')
    let dur = moment.duration(Number(parts[0]), parts[1])
    if (!dur.isValid(dur)) throw helper('core:makeError')('Invalid time')
    if (asDuration) return dur
    return asSecond ? dur.asSeconds() : dur.asMilliseconds()

//    let d = moment()
  }
}