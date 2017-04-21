var test = require('tape')
var Token = require('../Token')
var BN = require('ethjs').BN

test('token.stringify() with 18 digit number', function(t) {

  var balance = new BN('2307692307692307693', 10)
  var decimals = 18
  var token = new Token({ balance, decimals })
  var string = token.stringify()

  t.equal(string, '2.307', 'formats correctly')
  t.end()

})

test('token.stringify() with 17 decimal number', function(t) {

  var balance = new BN('2307692307692307693', 10)
  var decimals = 17
  var token = new Token({ balance, decimals })
  var string = token.stringify()

  t.equal(string, '23.076', 'formats correctly')
  t.end()

})
