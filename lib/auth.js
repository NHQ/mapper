var cookies = require('cookies')
var keygrip = require('keygrip')(['catpile', 'doglight'])

module.exports = function(req, res){

  var cookie = new cookies(req, res, keygrip)
  var sessionID = cookie.get('signed', {signed: true})

  if(!sessionID)

}
