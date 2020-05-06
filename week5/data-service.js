const Sequelize = require('sequelize');
var sequelize = new Sequelize('d36mh0udaj09g1', 'fwokjezysooosm', '99783eb73e3915a60dac219d775fede52ac606ad83cfc534ca24b73915c5bdff', {
 host: 'ec2-184-72-238-22.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
 }
});

sequelize.authenticate()
.then(function() {
    console.log('Connection has been established successfully.');
}).catch(function(err) {
    console.log('Unable to connect to the database:', err);
});

var Employees = sequelize.define('Employees', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

var Departments = sequelize.define('Departments',{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});


Departments.hasMany(Employees, {foreignKey: 'department'});

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(()=>{
            resolve("database sync complete");
        }).catch(()=>{
            reject("unable to sync the database");
        });
    });
};

module.exports.getAllEmployees = function (){
    return new Promise(function (resolve, reject) {
        Employees.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        });   
    });
};

module.exports.getEmployeesByStatus = function (status){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                status:status
            }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};

module.exports.getEmployeesByDepartment = function (department){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                department:department
            }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};

module.exports.getEmployeesByManager = function (manager){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                employeeManagerNum:manager
            }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};

module.exports.getEmployeeByNum = function (num){
    return new Promise(function (resolve, reject) {
        Employees.findAll({
            where:{
                employeeNum:num
            }
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};


module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Departments.findAll()
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("no results returned");
        });   
    });
};

module.exports.addEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        };
        Employees.create(employeeData)
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to create employee");
        });   
    });
};

module.exports.updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        };
        Employees.update(employeeData, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        });   
    });
};

module.exports.addDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for (const i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        };
        Departments.create(departmentData)
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to create department");
        });   
    });
};

module.exports.updateDepartment = function(departmentData){
    return new Promise(function (resolve, reject) {
        for (const i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        };
        Departments.update(departmentData, {
            where: {
                departmentId: departmentData.departmentId
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to update department");
        });   
    });
};

module.exports.getDepartmentById = function (id){
    return new Promise(function (resolve, reject) {
        Departments.findAll({
            where:{
                departmentId: id
            }
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            reject("no results returned");
        })
    });
};

module.exports.deleteDepartmentById = function(id){
    return new Promise(function(resolve,reject){
        Departments.destroy({
            where:{
                departmentId: id
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    })
};

module.exports.deleteEmployeeByNum = function(num){
    return new Promise(function(resolve,reject){
        Employees.destroy({
            where:{
                employeeNum: num
            }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    })
};