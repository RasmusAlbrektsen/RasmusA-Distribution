const fs = require("fs");
const express = require("express");
const server = express();

//Use files in the public folder
server.use(express.static('public'));

let rawdata = fs.readFileSync('db.json');
let db = JSON.parse(rawdata);
console.log(typeof(db.courses));
console.log(db);

async function writeToFile () {
    const json = JSON.stringify(db, null, 2);

        await fs.writeFile('db.json', json, (err) => {
            if(err) throw err;
        });
}

server.use(express.json());

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.get('/courses/', (req, res) => res.json(db));

server.get('/courses/:id', (req, res) => {
    if (req.params.id in db.courses) {
        res.json(db.courses[req.params.id]);
    } else {
        res.sendStatus(404);
    }
});

server.post('/add/course/', (req, res) => {
    db.courses.push(req.body);
    writeToFile();
    res.send(req.body);
    console.log(db);
});

server.post('/add/deadline/:courseID', (req, res) =>{
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