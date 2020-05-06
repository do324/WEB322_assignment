/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _____Doyeon Kim_________________ Student ID: __139766166___________ Date: ______2019/03/08__________
*
* Online (Heroku) Link: _______________  https://arcane-eyrie-57650.herokuapp.com/_________________________________________
*
********************************************************************************/
var exphbs = require('express-handlebars');   //handlebars
var express = require('express');
var app = express();
const fs = require("fs");
var path =  require('path');
var bodyParser = require('body-parser');
var data_service = require('./data-service.js');
var HTTP_PORT = process.env.PORT || 8080;
var multer = require('multer');

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
     cb(null, Date.now() + path.extname(file.originalname));
    }
  });

   
const upload = multer({ storage: storage }); 

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers:{
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
           },
           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }
    }
}));


app.set('view engine', '.hbs');


app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });



function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }


 

///////////////////////////////////////////////////////
/*GET ROUTE FOR PAGE IS HERE */
///////////////////////////////////////////////////////

//HOME
app.get("/", function (req,res){
    res.render('home');
 });



 //ABOUT
 app.get("/about", function (req,res){
    res.render('about');
});


//ADD EMPLOYEES
app.get("/employees/add", function (req,res){
    res.render('addEmployee');
});


//ADD IMAGE
app.get("/images/add", function (req,res){
    res.render('addImage');
});


/////////////////////////////////////////////////////
/*GET ROUTE FOR INFO IS HERE*/
/////////////////////////////////////////////////////

//EMPLOYEES INFO
app.get("/employees", function(req, res){
    if(req.query.status){
        data_service.getEmployeesByStatus(req.query.status)
        .then(function(data){
            res.render("employees", {employees: data});
        })
        .catch(function(err){
            res.render({message: "no results"});
        })
    }else if(req.query.manager){
        data_service.getEmployeesByManager(req.query.manager)
        .then(function(data){
            res.render("employees", {employees:data});
        })
        .catch(function(err){
            res.render({message: "no results"});
        })
    }
    else if(req.query.department){
        data_service.getEmployeesByDepartment(req.query.department)
        .then(function(data){
            res.render("employees", {employees:data});
        })
        .catch(function(err){
            res.render({message: "no results"});
        })
    }
    
    else{
        data_service.getAllEmployees()
        .then(function(data){
            res.render("employees", {employees:data});
        })
        .catch(function(err){
            res.render({message: "no results"});
        })
    }    
});

//DEPARTMENT INFO
app.get("/departments", (req,res) => {
    data_service.getDepartments().then((data)=>{
        res.render("departments" , {departments:data});
    });
});

//IMAGE
app.get("/images", function (req,res){
    var path_new = path.join(__dirname, "/public/images/uploaded");
        fs.readdir(path_new, function(err, files){
        res.render("images", {images: files});
        });
    });



//EMPLOYEE NUM
app.get("/employee/:num", function(req, res){
    data_service.getEmployeesByNum(req.params.num)
    .then(function(data){
       res.render("employee", {employee: data});
       })
    .catch(function(err){
        res.render("employee",{message:"no results"}); 
    });
});



////////////////////////////////////////////////
/*POST ROUTE IS HERE*/
////////////////////////////////////////////////

//ADD EMPLOYEES
app.post("/employees/add", function(req, res){
    data_service.addEmployee(req.body)
    .then(function(data){
        res.redirect("/employees")})
    .catch(function(err){
        res.send(err);
    })
});


//UPDATE EMPOYEE
app.post("/employee/update", function(req, res){
     data_service.updateEmployee(req.body)
     .then(function(){
         res.redirect("/employees")})
     .catch(function(err){
         res.render("employee",{message:"no results"});
     })
     
    });


//ADD IMAGE
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });


///////////////////////////////////////////////////
//////////////////////////////////////////////////




  app.use((req,res)=>{
    res.status(404).send("Page Not Found");
})


//initialze 
data_service.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("error: " + err);
});









