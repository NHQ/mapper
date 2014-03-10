module.exports = function(res, opts){
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Expose-Method', 'GET,PUT,POST,DELETE')
}
