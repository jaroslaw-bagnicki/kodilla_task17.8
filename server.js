var http = require('http');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var colors = require('colors');

var PORT = 8080;

var evetEmitter = new EventEmitter();
evetEmitter.on('load file', function(path) {
  console.log('laoding file ...');
  fs.readFile(path, function(err, data) {
    if (err) throw err;
    evetEmitter.emit('file loaded', data);
  });
});

console.log((getTime() + ' Starting server ...').yellow);

var server = http.createServer();

server.on('request', function(req, res) {
  console.log(getTime() + ' ' + req.method + ' on url ' + req.url);
  
  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.statusCode = 200;
    evetEmitter.emit('load file', './index.html');
    evetEmitter.on('file loaded', function(data) {
      res.write(data);
      res.end();
    });
  } else {
    res.setHeader('Content-Type', 'image/png');
    res.statusCode = 404;
    evetEmitter.emit('load file', './404.png');
    evetEmitter.on('file loaded', function(data) {
      res.write(data);
      res.end();
    });
  }
});

server.listen(PORT, function() {
  console.log((getTime() + ' Server running at http://localhost:' + PORT +'/').yellow);
});

function getTime() {
  var time = new Date().toTimeString();
  return ('[' + time.substr(0,8) + ']');
}
