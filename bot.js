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

function DataFetch(Str) {
    return new Promise(function(resolve, reject) {
        pool.query(Str, (err, res) => {
            if (err) {
                console.log(err.stack);
                reject("Failed.");
                throw err;
            } else {
                Fetch_result = res;
                resolve(Fetch_result);
            }
        });
    });
}

app.post('/login', urlencodedParser, function (req, res) {
	console.log(req.body.content);
	var username = req.body.content.split(", ")[0];
	var pw = req.body.content.split(", ")[1];
	var str = "SELECT id FROM account WHERE EXISTS ( SELECT * FROM account WHERE username = '" + username + "' ) LIMIT 1;";
	DataFetch(str).then(res => {
		if (typeof(res.rows[0]) == "undefined" || JSON.stringify(res.rows[0]).includes("null")) {
			res.send('此帳號不存在。');
    	} else {
			var str = "SELECT id FROM account WHERE EXISTS ( SELECT * FROM account WHERE password = '" + pw + "' ) LIMIT 1;";
			DataFetch(str).then(res => {
				if (typeof(res.rows[0]) == "undefined" || JSON.stringify(res.rows[0]).includes("null")) {
					res.send('密碼錯誤，請重新輸入。');
  				} else {
  					res.send(username + '，歡迎回來！');
    		   	}
			});
        }
	});
	
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
