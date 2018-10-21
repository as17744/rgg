const http = require('http');
const parse = require('url').parse;
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const chatServer = require('./lib/chat_server');
const dataResponse = require('./lib/controller/center');
const port = 80;
const cache = {};

const sendMiss = (res) => {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: Not Found');
    res.end();
}
const sendError = (res) => {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('Internal Server Error');
    res.end();
}
const dealError = (res, err) => {
    if (err.code === 'ENOENT') {
        sendMiss(res);
    } else {
        sendError(res);
    }
};
const sendFile = (res, filePath, stat) => {
    const mimeType = mime.getType(path.basename(filePath));
    res.writeHead(
        200,
        {
            'Content-Type': `${mimeType}; charset="utf-8"`,
            'Content-Length': stat.size,
        }
    );
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
    readStream.on('error', () => {
        sendError(res);
    });
};
const controlResponse = (res, filePath) => {
    fs.stat(filePath, (err, stat) => {
        if (err) {
            dealError(res, err);
        } else {
            sendFile(res, filePath, stat);
        }
    });
};
const server = http.createServer();
server.on('request', (req, res) => {
    let target = '';
    if (req.url.indexOf('.html') > -1 && req.url.indexOf('index.html') === -1) {
        const catalogList  = req.url.match(/^(\/)(\w*)(\.html)/);
        const targetDirectory = catalogList[2];
        target =  `./dist/${targetDirectory}/index.html`;
    } else {
        target = `./dist${req.url}`;
    }
    if (parse(req.url).pathname === '/mroute') {
        dataResponse(req, res);
    } else {
        controlResponse(res, target);
    }
});
chatServer.liten(server);
server.listen(port, () => {
    console.log(`Server is listening in port ${port}`);
});
