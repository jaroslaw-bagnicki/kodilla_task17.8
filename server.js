var http = require('http');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
require('colors');

var config = {
  HOSTNAME: '127.0.0.1',
  PORT: 8080
};

var evetEmitter = new EventEmitter();

evetEmitter.on('load file', function(path) {
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
    evetEmitter.once('file loaded', function(data) {
      res.write(data);
      res.end();
    });
  } else {
    res.setHeader('Content-Type', 'image/png');
    res.statusCode = 404;
    evetEmitter.emit('load file', './404.png');
    evetEmitter.once('file loaded', function(data) {
      res.write(data);
      res.end();
    });
  }
});

server.listen(config.PORT, config.HOSTNAME, function() {
  console.log((getTime() + ' Server running at http://' + config.HOSTNAME + ':' + config.PORT +'/').yellow);
});

function getTime() {
  var time = new Date().toTimeString();
  return ('[' + time.substr(0,8) + ']');
}
