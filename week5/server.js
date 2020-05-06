/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _____Doyeon Kim_________________ Student ID: __139766166___________ Date: ______2019/03/29__________
*
* Online (Heroku) Link: _______________  https://arcane-eyrie-57650.herokuapp.com/_________________________________________
*
********************************************************************************/
var exphbs = require('express-handlebars');   //handlebars
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var dataService = require('./data-service.js');
var HTTP_PORT = process.env.PORT || 8080;
var multer = require('multer');
var storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

var upload = multer({ storage: storage });

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', exphbs({ extname:'.hbs', defaultLayout:'main',
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
/*ALL GET ROUTE IS HERE */
///////////////////////////////////////////////////////
//home
app.get("/",(req,res)=>{
    res.render('home');
});

//home
app.get("/home",(req,res)=>{
    res.render('home');
});

//about
app.get("/about",(req,res)=>{
    res.render('about');
});



//
app.get("/employees",(req,res)=>{
    if (req.query.status){
        dataService.getEmployeesByStatus(req.query.status) 
        .then((data)=>{
            if (data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{ message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    } else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
        .then((data)=>{
            if (data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{ message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    } else if (req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then((data)=>{
            if (data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{ message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        })
    } else {
        dataService.getAllEmployees()
        .then((data)=>{
            if(data.length > 0) {
                res.render("employees",{Employees:data});
            } else {
                res.render("employees",{message: "no results" });
            }
        })
        .catch(()=>{
            res.render("employees",{message: "no results"});
        });
    }
})

//add image get route
app.get("/images/add", (req,res) => {
    res.render('addImage');
});


app.get("/employees/add",(req,res)=>{
    dataService.getDepartments()
    .then((data) =>{
        res.render('addEmployee',{Departments: data});
    })
    .catch(()=> {
        res.render('addEmployee',{Departments:[]});
    })   
});

app.get("/employee/:empNum", (req, res) => {
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; 
        } else {
            viewData.employee = null; 
        }
    })
    .catch(() => {
        viewData.employee = null; 
    })
    .then(dataService.getDepartments)
    .then((data) => {
        viewData.departments = data; 
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    })
    .catch(() => {
        viewData.departments = []; 
    })
    .then(() => {
        if (viewData.employee == null) {
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData });
        }
    });
});

app.get("/employees/delete/:num",(req,res)=>{
    dataService.deleteEmployeeByNum(req.params.num)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove Employee / Employee not found");
    })
});

app.get("/departments",(req,res)=>{
    dataService.getDepartments()
    .then((data)=>{
        if (data.length > 0) {
            res.render("departments", {Departments: data});
        } else {
            res.render("departments",{message: "no results"});
        }
    })
    .catch(()=>{
        res.render("departments",{message: "no results"});
    });
});

app.get('/departments/add', (req, res) => {
    res.render('addDepartment')
});

app.get('/department/:departmentId', (req, res) => {
    dataService.getDepartmentById(req.params.departmentId)
    .then((data) => {
        res.render("department",{department:data}); 
    })
    .catch(() => {
        res.status(404).send("Department Not Found");
    })
});

app.get("/departments/delete/:departmentId",(req,res)=>{
    dataService.deleteDepartmentById(req.params.departmentId)
    .then(()=>{
        res.redirect("/departments");
    })
    .catch(()=>{
        res.status(500).send("Unable to Remove Department / Department not found");
    })
});


app.get("/images", (req,res) => {
    var here = path.join(__dirname, "public/images/uploaded");
    fs.readdir(here, (err, files) => {
        res.render("images",{ 
            data: files});
    });
});



app.get("/images/add",(req,res)=>{
    res.render('addImage');
});

////////////////////////////////////////////////
/*POST ROUTE IS HERE*/
////////////////////////////////////////////////

//new employees
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to add Employee");
    });
});
//update employee
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(()=>{
        res.redirect("/employees");
    })
    .catch(()=>{
        res.status(500).send("Unable to Update Employee");
    })
});

//new department
app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body)
    .then(() => {
        res.redirect("/departments")
    })
    .catch(()=>{
        res.status(500).send("Unable to to add Department");
    });
});

//update a department
app.post("/departments/update", (req, res) => {
    dataService.updateDepartment(req.body)
    .then(() => {
        res.redirect("/departments");
    })
    .catch(()=>{
        res.status(500).send("Unable to update department");
    })
});
//new image
app.post("/images/add", upload.single(("imageFile")), (req, res) => {
    res.redirect("/images");
});


////////////////////////////////////////////////////////////////////////////////

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
})

dataService.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err)=>{
    console.log("error: " + err);
});
