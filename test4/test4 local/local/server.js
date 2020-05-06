var express = require('express');
var pg = require('pg');
var app = express();

//This is using localPG on local drive.
var config = {
    user: 'postgres',
    database: 'postgres',
    password: '5114',
    port: 5432,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, 
   };
   

var pool = new pg.Pool(config);
var HTTP_PORT = process.env.PORT || 8080;

app.get('/', function (req, res, next) { 
    pool.connect(function(err,client,done) {
        if(err) {
            console.log("not able to get connection "+ err); 
            res.status(400).send(err);
        }
        client.query('SELECT * FROM public."Employee" where empid=1', function(err,result) {
            done(); // closing the connection;
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows); 
        });
    }); 
});

app.get('/sp', function (req, res, next){
    pool.connect(function(err,client,done) {
        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }
        client.query('SELECT * from getallemployee()' ,function(err,result) {
            done(); // closing the connection;
            if(err){
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

app.get('/pool', function (req, res) {
    pool.connect(function(err,client,done) {
    if(err){
    console.log("not able to get connection "+ err);
    res.status(400).send(err);
    }
    client.query('SELECT * from getallemployee()' ,function(err,result)
   {
    //call `done()` to release the client back to the pool
    done();
    if(err){
    console.log(err);
    res.status(400).send(err);
    }
    res.status(200).send(result.rows);
    });
    });
   });
   

app.listen(HTTP_PORT, function(){
    console.log('Server is running');
});


