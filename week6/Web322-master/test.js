var employees = [];
var departments = [];
const fs = require("fs");

// Initializer.

module.exports.initialize = function() {

return new Promise(function(resolve, reject) {

try {

fs.readFile('./data/employees.json', (err, data)=> {

if (err) { reject( err); }

employees = JSON.parse(data);

});

fs.readFile('./data/departments.json', (err, data)=> {

if (err) { reject( err); }

departments = JSON.parse(data);

});

}

catch (ex) {

reject("unable to read file");

}

resolve(" File successfully read.");

});

}

// Returns all employees data.

module.exports.getAllEmployees = function() {

var AllEmployees = [];

return new Promise((resolve, reject) => {

for (var i = 0; i < employees.length; i++) {

AllEmployees.push(employees[i]);

}

if (AllEmployees.length == 0) {

reject("No data");

}

resolve(AllEmployees);

});

}

// Returm emplloyees with isManager property is true

module.exports.getManagers = function() {

var Managers = [];

return new Promise(function(resolve, reject) {

for (var i = 0; i < employees.length; i++) {

if (employees[i].isManager == true){

Managers.push(employees[i]); }

}

if (Managers.length == 0) {

reject("No data");

}

resolve(Managers);

});

}

// Returns all the department.

module.exports.getDepartments = function() {

return new Promise(function(resolve, reject) {

if (departments.length == 0) {

reject("No Data");

}

resolve(departments);

});

}

module.exports.addEmployee =(employeeData) =>{

if(!employeeData.isManager){ employeeData.isManager=false;}

else return true;

employeeData.employeeNum = employees.length+1;

employees.push(employeeData);

return new Promise((resolve, reject) => {

resolve(employees);

if(employees.length == 0)

reject("No Data");

});

}

module.exports.getEmployeesByStatus = (status) =>{

return new Promise((resolve, reject) => {

let statEmploy = employees.filter(emp => emp.status == status);

resolve(statEmploy);

if(employees.length == 0){

reject("No Data");

}

});

}

module.exports.getEmployeesByDepartment = (department)=>{

return new Promise((resolve, reject) => {

var filteredEmployees = employees.filter(employees => employees.department == department);

resolve(filteredEmployees);

if(filteredEmployees.length == 0)

reject("No Data");

});

}

module.exports.getEmployeesByManager =(manager) =>{

return new Promise((resolve, reject) => {

var empManeger = employees.filter(employees => employees.employeeManagerNum == manager);

resolve(empManeger);

if(employees.length == 0){

reject("No Data");

}

});

}

module.exports.getEmployeesByNum = (num) => {

return new Promise((resolve, reject) => {

var empNum = employees.filter(emp => emp.employeeNum == num);

resolve(empNum[0]);

if(employees.length == 0){

reject("No Data");

}
 
});

} 