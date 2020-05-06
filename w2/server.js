/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _____Doyeon KIM_________________ Student ID: ____139766166__________ Date: ____2019/01/31_________
*
* Online (Heroku) Link: ____ https://frozen-tor-14147.herokuapp.com____________________________________________________
*
********************************************************************************/ 
var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js"); 

var HTTP_PORT = process.env.PORT || 8080;


app.use(express.static('public'));

//
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname + "/view/home.html"));
});

app.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname + "/view/home.html"));
});

app.get("/about",(req,res)=>{
    res.sendFile(path.join(__dirname + "/view/about.html"));
});

app.get("/employees", (req, res) => {
    dataService.getAllEmployees().then((employees) => {
        res.json(employees);
    }).catch((errorMessage) => {
        res.json({ message: errorMessage });
    });
});

app.get("/managers", (req, res) => {
    dataService.getManagers().then((managers) => {
        res.json(managers);
    }).catch((errorMessage) => {
        res.json({ message: errorMessage });
    });
});

app.get("/departments", (req, res) => {
    dataService.getDepartments().then((departments) => {
        res.json(departments);
    }).catch((errorMessage) => {
        res.json({ message: errorMessage });
    });
});

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
})

dataService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log("error : " + err);
});


