var express = require('express')
var app = express();
const Pool = require('pg').Pool;
const PG = require('pg').Client;

var connectionString = "postgres://ovqncaumgpquxk:fc8f9c2d46718c0c19a9a7347b625be39427da172d29ad8872585b47713a9a2e@ec2-52-203-182-92.compute-1.amazonaws.com:5432/dcj5uh9l45tnk7";

const pg = new PG({
    connectionString: connectionString,
    ssl: true
});
const pool = new Pool({
    connectionString: connectionString,
    ssl: true
});

app.listen(process.env.PORT || 5000);

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/login', urlencodedParser, function (req, res) {
	console.log(req.body.account);
	console.log(req.body.password);
	res.send('hello world!');
});

app.post('/register', urlencodedParser, function (req, res) {
	res.send('');
});

app.post('/project', urlencodedParser, function (req, res) {
	res.send('');
});

app.post('/select', urlencodedParser, function (req, res) {
	res.send('');
});