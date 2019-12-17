const fs = require("fs");
const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const server = express();

//Use files in the public folder
server.use(express.static('public'));

let rawdata = fs.readFileSync('db.json');
let db = JSON.parse(rawdata);
console.log(typeof(db.courses));

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

const jwtSecret = "this is my secret";

function isAuthorized(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        let token = req.headers.authorization;
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
            console.log("Token to authorize " + token)
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
    const username = req.body.username;
    const password = req.body.password;
    for(var i in db.users) {
        var user = db.users[i];
        if (username == user.username && password == user.password) {
            var token = jwt.sign({ username: user.username }, jwtSecret, {algorithm: 'HS256', expiresIn: '24hr'});
            console.log("Log from post in server = " + token);
            res.status(200).send({ auth: true, token: token });
            break;
        } else {
            res.status(401).json({
                sucess: false,
                token: null,
                err: "Incorrect username or password"
            });
        }
    }
});

server.get('/signed', isAuthorized, (req, res) => {
    res.send('Authenticated');
});

server.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

server.get('/users/courses/:username', isAuthorized, (req, res) => {
    var username = req.params.username;
    for(var i in db.users) {
        var user = db.users[i];
        if (user.username == username) {
            res.json(db.users[i].courses);
        }
    }
});

server.get('/users/courses/:id', isAuthorized, (req, res) => {
    if (req.params.id in db.courses) {
        res.json(db.courses[req.params.id]);
    } else {
        res.sendStatus(404);
    }
});

server.post('/users/courses/', (req, res) => {
    db.courses.push(req.body);
    writeToFile();
    res.send(req.body);
    console.log(db);
});

server.post('/users/:username/courses/:courseID', (req, res) =>{
    if (req.params.courseID in db.courses) {
        db.courses[req.params.courseID].deadlines.push(req.body);
        writeToFile();
        res.send(req.body);
        console.log(db.courses[req.params.courseID]);
    } else {
        res.sendStatus(404);
    }
});

server.listen(8080);