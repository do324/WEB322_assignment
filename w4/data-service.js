var employees = new Array();
var departments = new Array();

const fs = require("fs");


module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        try{
            fs.readFile('./data/employees.json', (err, data) => {
                try{
                    employees = JSON.parse(data)
                }catch(ex){
                    reject('Unable to read file')
                }
            })
            fs.readFile('./data/departments.json', (err, data) => {
                try{
                    departments = JSON.parse(data)
                }catch(ex){
                    reject('Unable to read file')
                }
            })
        }catch(ex){
            reject('Unable to read file')
        }
        resolve()
    })
}


module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => { 
        if (employees.length == 0) {
            reject('no results returned')
        } else {
            resolve(employees) 
        }
    })
}


module.exports.getManagers = function () {
    var managers = []
    return new Promise((resolve, reject) => {
        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                managers.push(employees[i])
            }
        }
        if (managers.length == 0) {
            reject('no results returned')
        } else {
            resolve(managers) 
        }
    })
}



module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => { 
        if (departments.length == 0) {
            reject('no results returned')
        } else {
            resolve(departments)
        }
    })
}

module.exports.addEmployee = function(employeeData){
    return new Promise (function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;
        employeeData.employeeNum = employees.length + 1;
        if(employees.length == 0){
            reject("no results returned");
        }
        else{
            employees.push(employeeData);
            resolve(employee);
        }
    });
}

module.exports.updateEmployee = function(employeeData){
  return new Promise ((resolve, reject)=>{
        for(let i = 0; i < employees.length; i++){
            if(employees[i].employeeNum == employeeData.employeeNum){
                employees[i] = employeeData;
            }
        }
        resolve();
    });
}

module.exports.getEmployeesByStatus = function (status){
    return new Promise (function(resolve, reject){
        if(employees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(employees.filter(function(item, index, array){
                return item.status = status;
            }));
        }
    });
}

module.exports.getEmployeesByDepartment = function (department){
    return new Promise (function(resolve, reject){
        if(employees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(employees.filter(function(item, index, array){
                return item.department = department;
            })); 
        }
    });
}

module.exports.getEmployeesByManager = function (manager){
    return new Promise (function(resolve, reject){
        if(employees.length == 0){
            reject("no results returned");
        }
        resolve(employees.filter(function(item, index, array){
            return item.employeeManagerNum = manager;
        }));
    });
}

module.exports.getEmployeeByNum = function (num){
    return new Promise (function(resolve, reject){
        if(employees.length == 0){
            reject("no results returned");
        }
        else{
            resolve(employees.find(function(item, index, array){
                return item.employeeNum == num;
            }));
        }
    });
}

