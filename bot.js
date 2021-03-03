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
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

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

app.post('/login', urlencodedParser, function(req, response) {
    console.log(req.body.content);
    var username = req.body.content.split(", ")[0];
    var pw = req.body.content.split(", ")[1];

    var str = "SELECT id FROM account WHERE EXISTS ( SELECT * FROM account WHERE username = '" + username + "' ) LIMIT 1;";
    DataFetch(str).then(res => {
        if (typeof(res.rows[0]) == "undefined" || JSON.stringify(res.rows[0]).includes("null")) {
            response.send('此帳號不存在。');
        } else {
            var str = "SELECT id FROM account WHERE EXISTS ( SELECT * FROM account WHERE username = '" + username + "' AND password = '" + pw + "' ) LIMIT 1;";
            DataFetch(str).then(res => {
                if (typeof(res.rows[0]) == "undefined" || JSON.stringify(res.rows[0]).includes("null")) {
                    response.send('密碼錯誤，請重新輸入。');
                } else {
                    response.send(username + '，歡迎回來！');
                }
            });
        }
    });
});

app.post('/register', urlencodedParser, function(req, response) {
    console.log(req.body.content);
    var username = req.body.content.split(", ")[0];
    var pw = req.body.content.split(", ")[1];
    var str = "SELECT username FROM account WHERE EXISTS ( SELECT * FROM account WHERE username = '" + username + "' ) LIMIT 1;";
    DataFetch(str).then(res => {
        console.log(res.rows);
        if (typeof(res.rows[0]) == "undefined" || JSON.stringify(res.rows[0]).includes("null")) {
            var id = "";
            for (var i = 0; i <= 16; i++) {
                id += Math.floor(Math.random() * 10) + 1;
            }
            var str = "INSERT INTO account (username, password, id) VALUES ('" + username + "', '" + pw + "', '" + id + "');";
            pool.query(str, (err, res) => {
                if (err) {
                    console.log(err.stack);
                    reject("Failed.");
                    throw err;
                } else {
                    response.send('註冊成功！');
                }
            });
        } else {
            response.send('本帳號已存在！請試著使用其他帳號。');
        }
    });
});

app.post('/project', urlencodedParser, function(req, response) {
    console.log(req.body.content);
    var name = req.body.content.split(", ")[0];
    var type = req.body.content.split(", ")[1];
    var height = req.body.content.split(", ")[2];
    var weight = req.body.content.split(", ")[3];
    var sex = req.body.content.split(", ")[4];
    var age = req.body.content.split(", ")[5];
    var bmi = req.body.content.split(", ")[6];
    var calories = req.body.content.split(", ")[7];
    var public = req.body.content.split(", ")[8];
    var author = req.body.content.split(", ")[9];
    var str = "SELECT name FROM projects WHERE EXISTS ( SELECT * FROM account WHERE name = '" + name + "' ) LIMIT 1;";
    DataFetch(str).then(res => {
        console.log(res.rows);
        if (typeof(res.rows[0]) == "undefined" || JSON.stringify(res.rows[0]).includes("null")) {
            var str = "INSERT INTO projects (name, type, height, weight, sex, age, bmi, calories, public, author) VALUES ('"+ name + "', '"+ type + "', '"+ height + "', '"+ weight + "', '" + sex + "', '" + age + "', '" + bmi + "', '" + calories + "', '" + public + "', '" + author + ");";
            pool.query(str, (err, res) => {
                if (err) {
                    console.log(err.stack);
                    reject("Failed.");
                    throw err;
                } else {
                    response.send('計畫登錄成功！');
                }
            });
        } else {
            response.send('此計畫名稱已存在，請嘗試使用其他名稱。');
        }
    });
});

app.post('/getlist', urlencodedParser, function(req, response) {
	console.log(req.body.content);
    var name = req.body.content;
    var str = "SELECT name FROM projects WHERE EXISTS ( SELECT * FROM account WHERE name = '" + name + "' );";
    DataFetch(str).then(res => {
        console.log(res.rows);
        if (typeof(res.rows[0]) == "undefined" || JSON.stringify(res.rows[0]).includes("null")) {
            response.send('');
        } else {
        	var projectName = "";
        	for (var i = res.rows.length - 1; i > 0; i--) {
        		if (i == 0) {
					projectName += res.rows[i];
        		} else {
        			projectName += res.rows[i] + ",";
        		}
        	}
        	console.log(projectName);
            response.send(projectName);
        }
    });


});

app.post('/getmonth', urlencodedParser, function(req, response) {
	var date = new Date();
    response.send((date.getMonth() + 1).toString());
});

