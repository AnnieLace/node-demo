/*
    server.js
    main server script for our task list web service
*/

var port = 8080;

//load all modules we need
//express web server framework
//require loads a module and makes it available in our server
//give back a function
var express = require('express');
//sqlite library
var sqlite = require('sqlite3');
//body parser library
var bodyParser = require('body-parser');

//create a new express app
var app = express();

//tell express to serve static files from the static subdirectory
//takes a path to the static files you want to serve
app.use(express.static(__dirname + '/static'));

//tell express to parse post body data as json
app.use(bodyParser.json());

//api route for getting tasks
//takes request and responce objects, as well as a function that
//will make sure the error gets passed back to the client
app.get('/api/tasks', function(req, res, next) {
    //sqlite automatically adds rowid can be used like a primary key
    var sql = 'select rowid,title,done,createdOn from tasks where done != 1';
    //rows is a javascript array
    db.all(sql, function(err, rows) {
        if(err) {
            return next(err);
        }
        //send rows back to client as JSON
        res.json(rows);
    });
});

//is called on post rather than get on /api/tasks
//will insert a new object into the database
app.post('/api/tasks', function(req, res, next){
    var newTask = {
        title: req.body.title,
        done: false,
         createdON: new Date()
    };
    var sql = 'insert into tasks(title, done, createdOn) values(?,?,?)';
    db.run(sql, [newTask.title, newTask.done, newTask.createdOn], function(err) {
        if(err) {
            return next(err);
        }

        //201 status means something got created on the server successfully
        res.status(201).json(newTask);
    })
});

//create database
var db = new sqlite.Database(__dirname + '/data/tasls.db', function(err) {
    if(err) {
        throw err;
    }

    var sql = 'create table  if not exists ' +
        'tasks(title string, done int, createdOn datetime)';
    db.run(sql, function(err) {
        if(err) {
            throw err;
        }

    });

    //start the server
    app.listen(port, function() {
        console.log('server is listening on http://localhost:' + port);
    });

});

