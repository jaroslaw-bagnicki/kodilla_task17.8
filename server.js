var http = require('http');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var colors = require('colors');

var PORT = 8080;

var evetEmitter = new EventEmitter();

console.log((getTime() + ' Starting server ...').yellow);

var server = http.createServer();

server.on('request', function(req, res) {
  console.log(getTime() + ' ' + req.method + ' on url ' + req.url);
  
  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.statusCode = 200;
    fs.readFile('./index.html', function(err, data) {
      if (err) throw err;
      evetEmitter.emit('index.html loaded', data);
    });
    evetEmitter.on('index.html loaded', function(data) {
      res.write(data);
      res.end();
    });
  } else {
    res.setHeader('Content-Type', 'image/png');
    res.statusCode = 404;
    fs.readFile('./404.png', function(err, data) {
      if (err) throw err;
      evetEmitter.emit('404.png loaded', data);
    });
    evetEmitter.on('404.png loaded', function(data) {
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
