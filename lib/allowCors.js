module.exports = function(res, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Expose-Method', 'GET,PUT,POST,DELETE')
  next()
}
