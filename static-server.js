var static = require('node-static');
var fileServer = new static.Server('./dist');

require('http').createServer(function(request, response) {
  request.addListener('end', function() {
    fileServer.serve(request, response);
  }).resume();
}).listen(8080);

require("openurl").open("http://localhost:8080")