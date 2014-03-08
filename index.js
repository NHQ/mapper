var fs = require('fs')
var ls = new (require('json-stream'))
var restify = require('restify')
var level = require('levelup')
var sub = require('level-sublevel')
var geoLevel = require('level-geo')
var uuid = require('uuid')
var concat = require('concat-stream')
//var db = sub(level('./data'))
//var geo = db.sublevel('geo')
var DB = level('./data')
var gdb = geoLevel(DB)
var server = restify.createServer({
	name: 'geoTest',
	version: '0.0.1'
})
var count = 0
console.log(DB.location)
var rs = fs.createReadStream('./trees.geojson').pipe(ls).on('data', function(data){
	var id = uuid.v4()
	data = {species: data.properties.SPECIES, lng: data.geometry.coordinates[0], lat: data.geometry.coordinates[1]}
//	console.log(data)
	gdb.put(id, data)
})

rs.on('end', function(){
	console.log('done\n')
	gdb.createSearchStream({
		bbox: [[-122.18280096717119, 37.78858395077543], [-122.18280096717119, 37.78858395077543]]
	}).on('data', function(data){console.log(data)})	
})

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/data', function(req, res, next){
	res.writeHead(200, {"Content-Type":"application/json"})
	var r = parseFloat(req.params.radius) || .002
	var bbox = [ [ parseFloat(req.params.lng) - r, parseFloat(req.params.lat) - r], [ parseFloat(req.params.lng) + r, parseFloat(req.params.lat) + r] ];
	var s = gdb.createSearchStream({
		bbox: bbox
	//	bbox: [[-122.18280096717119, 37.78858395077543], [-122.18280096717119, 37.78858395077543]]
	}).pipe(concat(function(data){
		if(!data.length) data = []; 
		res.write(JSON.stringify(data));
		res.end()
	}))
	s.on('error', console.log)
	s.on('end', function(){})
})

server.post('/data', function(req, res, next){
	var id = uuid.v4()
	geo.put(id, req.params, function(err){
		if(err) console.error(err)
	})
	res.writeHead(200)
	res.end()
})

server.listen(11111, function () {
  console.log('%s listening at %s', server.name, server.url);
});
//g.geocode('3276 logan st, oakland ca 94601', function(err, loc){
//	console.log(err, loc)	
//})
