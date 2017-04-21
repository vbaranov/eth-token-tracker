const BN = require('ethjs').BN

module.exports = {
  formatBalance,
}

function isAllOneCase (address) {
  if (!address) return true
  var lower = address.toLowerCase()
  var upper = address.toUpperCase()
  return address === lower || address === upper
}

// Takes wei Hex, returns wei BN, even if input is null
function numericBalance (balance) {
  if (!balance) return new BN(0, 16)
  var stripped = stripHexPrefix(balance)
  return new BN(stripped, 16)
}

// Takes  hex, returns [beforeDecimal, afterDecimal]
function parseBalance (balance, precision) {
  var beforeDecimal, afterDecimal
  const wei = numericBalance(balance)
  var weiString = wei.toString()
  const trailingZeros = /0+$/

  beforeDecimal = weiString.length > precision ? weiString.slice(0, weiString.length - precision) : '0'
  afterDecimal = ('000000000000000000' + wei).slice(-1 * precision).replace(trailingZeros, '')
  if (afterDecimal === '') { afterDecimal = '0' }
  return [beforeDecimal, afterDecimal]
}

// Takes wei hex, returns an object with three properties.
// Its "formatted" property is what we generally use to render values.
function formatBalance (balance, decimalsToKeep, precision = 3) {
  var parsed = parseBalance(balance, precision)
  var beforeDecimal = parsed[0]
  var afterDecimal = parsed[1]
  var formatted = 'None'
  if (decimalsToKeep === undefined) {
    if (beforeDecimal === '0') {
      if (afterDecimal !== '0') {
        var sigFigs = afterDecimal.match(/^0*(.{2})/) // default: grabs 2 most significant digits
        if (sigFigs) { afterDecimal = sigFigs[0] }
        formatted = '0.' + afterDecimal
      }
    } else {
      formatted = beforeDecimal + '.' + afterDecimal.slice(0, 3)
    }
  } else {
    afterDecimal += Array(decimalsToKeep).join('0')
    formatted = beforeDecimal + '.' + afterDecimal.slice(0, decimalsToKeep)
  }
  return formatted
}


function generateBalanceObject (formattedBalance, decimalsToKeep = 1) {
  var balance = formattedBalance.split(' ')[0]
  var label = formattedBalance.split(' ')[1]
  var beforeDecimal = balance.split('.')[0]
  var afterDecimal = balance.split('.')[1]
  var shortBalance = shortenBalance(balance, decimalsToKeep)

  if (beforeDecimal === '0' && afterDecimal.substr(0, 5) === '00000') {
    // eslint-disable-next-line eqeqeq
    if (afterDecimal == 0) {
      balance = '0'
    } else {
      balance = '<1.0e-5'
    }
  } else if (beforeDecimal !== '0') {
    balance = `${beforeDecimal}.${afterDecimal.slice(0, decimalsToKeep)}`
  }

  return { balance, label, shortBalance }
}

function shortenBalance (balance, decimalsToKeep = 1) {
  var truncatedValue
  var convertedBalance = parseFloat(balance)
  if (convertedBalance > 1000000) {
    truncatedValue = (balance / 1000000).toFixed(decimalsToKeep)
    return `${truncatedValue}m`
  } else if (convertedBalance > 1000) {
    truncatedValue = (balance / 1000).toFixed(decimalsToKeep)
    return `${truncatedValue}k`
  } else if (convertedBalance === 0) {
    return '0'
  } else if (convertedBalance < 0.001) {
    return '<0.001'
  } else if (convertedBalance < 1) {
    var stringBalance = convertedBalance.toString()
    if (stringBalance.split('.')[1].length > 3) {
      return convertedBalance.toFixed(3)
    } else {
      return stringBalance
    }
  } else {
    return convertedBalance.toFixed(decimalsToKeep)
  }
}

function dataSize (data) {
  var size = data ? stripHexPrefix(data).length : 0
  return size + ' bytes'
}

function isHex (str) {
  return Boolean(str.match(/^(0x)?[0-9a-fA-F]+$/))
}

function stripHexPrefix (address) {
  if (address.indexOf('0x') === 0) {
    return address.substr(2)
  } else {
    return address
  }
}
