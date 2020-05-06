var employees = new Array();
var departments = new Array();
var fs = require('fs');

//initialize
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        try{
            fs.readFile('./data/employees.json', (err, data) => {
                try{
                    employees = JSON.parse(data)
                }catch(ex){
                    reject('Unable to read employees')
                }
            })
            fs.readFile('./data/departments.json', (err, data) => {
                try{
                    departments = JSON.parse(data)
                }catch(ex){
                    reject('Unable to read departments')
                }
            })
        }catch(ex){
            reject('Unable to read it')
        }
        resolve()
    })
}

//
module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => { 
        if (employees.length == 0) {
            reject('no results of employees returned')
        } else {
            resolve(employees) 
        }
    })
}

///
module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => { 
        if (departments.length == 0) {
            reject('no results of departments returned')
        } else {
            resolve(departments) 
        }
    })
}

//
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


