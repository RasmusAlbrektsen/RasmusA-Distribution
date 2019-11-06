//const http = require("http");
//const url = require("url");
const fs = require("fs");
const express = require("express");
const server = express();

let rawdata = fs.readFileSync('db.json');
let db = JSON.parse(rawdata);
console.log(db);

server.get('/users/', (req, res) => res.json(db));
server.get('/users/:id', (req, res) => {
    if (req.params.id in db.users) {
        res.json(db.users[req.params.id]);
    } else {
        res.sendStatus(404);
    }
})
server.listen(8080);


/*
let dispatch = Object.create(null);
dispatch.GET = (request, response) => {
    switch (url.parse(request.url).pathname) {
        case "/users/0":
            response.writeHead(200, {"Content-Type": "text/json"});
            response.end(JSON.stringify(db[0]));
            break;
        default:
            response.writeHead(404, {"Content-Type": 'text/plain'});
            response.end('WTF mate\n')
    }
}

http.createServer((request, response) => {
    try {dispatch[request.method] (request, response); }
    catch (err) {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end('Method not allowed\n');
    }
}).listen(8080);
*/