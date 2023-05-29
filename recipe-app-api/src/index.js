import { createServer } from 'http';
var server = createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'Welcome to Shmuel Toporowitch website!!!!!\n',
        version = 'NodeJS ' + process.versions.node + '\n',
        respond = [message, version].join('\n')
    res.end(respond);
});

server.listen()