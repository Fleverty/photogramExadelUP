let http = require('http');
let fs = require('fs');

http.createServer((request, response) => {

  if (request.url == '/') {
    let file = new fs.ReadStream(__dirname + '/public/UI/index.html');
    sendFile(file, response, {'Content-type': 'text/html;charset=utf-8'});
  }
  else if(request.url.indexOf('.js') != -1){
    let file = new fs.ReadStream(__dirname + '/public/UI' + request.url);
    sendFile(file, response, {'Content-type': 'text/javascript'});

  }else if(request.url.indexOf('.css') != -1){
    let file = new fs.ReadStream(__dirname + '/public/UI' + request.url);
    sendFile(file, response, {'Content-type': 'text/css'});
  }
  else if(request.url.indexOf('.jpg') != -1 || request.url.indexOf('.png') != -1) {
    let file = new fs.ReadStream(__dirname + '/public' + request.url);
    sendFile(file, response, {'Content-type': 'text/jpeg'});
  }

  else if(request.url.indexOf('.ttf') != -1) {
      let file = new fs.ReadStream(__dirname + '/public/UI' + request.url);
      sendFile(file, response, {'Content-type': 'text/TrueType'});
  }

}).listen(8000);

function sendFile(file, response, headers) {
  response.writeHead(200, headers);
  file.pipe(response);
}