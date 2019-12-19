const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const server = express();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//Use files in the public folder
server.use(express.static('public'));

let rawdata = fs.readFileSync('db.json');
let db = JSON.parse(rawdata);
const jwtSecret = "this is my secret";

async function writeToFile () {
    const json = JSON.stringify(db, null, 2);
        await fs.writeFile('db.json', json, (err) => {
            if(err) throw err;
        });
}

server.use(express.json());

server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", 'Content-Type: application/json');
  next();
});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


function isAuthorized(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        var token = req.headers.authorization;
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                res.status(500).json({ error: "Not Authorized" });
                throw new Error("Not Authorized");
            }
            return next();
        });
    } else {
        res.status(500).json({ error: "Not Authorized" });
        throw new Error("Not Authorized");
    }
}

server.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    for(var i in db.users) {
        var user = db.users[i];
        if (username == user.username && bcrypt.compareSync(password, user.password)) {
                var token = jwt.sign({ username: user.username }, jwtSecret, {algorithm: 'HS256', expiresIn: '1hr'});
                res.status(200).send({ auth: true, token: token });
        }
    }
});

server.get('/users/:username/courses', isAuthorized, (req, res) => {
    var username = req.params.username;
    for(var i in db.users) {
        var user = db.users[i];
        if (user.username == username) {
            res.json(db.users[i].courses);
        }
    }
});

server.get('/users/:username/courses/:id', isAuthorized, (req, res) => {
    var username = req.params.username;
    for (var i in db.users) {
        var user = db.users[i];
        if (user.username == username && req.params.id in db.users.courses) {
            res.json(db.courses[req.params.id]);
        }
    }
});

server.post('/users/:username/courses', isAuthorized, (req, res) => {
    var username = req.params.username;
    for(var i in db.users) {
        var user = db.users[i];
        if (user.username == username) {
            db.users[i].courses.push(req.body);
            writeToFile();
            res.send(req.body);
        }
    }
});

server.post('/users/:username/courses/:courseID/deadlines', isAuthorized, (req, res) =>{
    var username = req.params.username;
    for(var i in db.users) {
        var user = db.users[i];
        if (user.username == username) {
            db.users[i].courses[req.params.courseID].deadlines.push(req.body);
            writeToFile();
            res.send(req.body);
        }
    }
});

server.listen(8080);