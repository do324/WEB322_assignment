var fs = require("fs");
const Sequelize = require("sequelize");

var sequelize = new Sequelize('d36mh0udaj09g1', 'fwokjezysooosm', '99783eb73e3915a60dac219d775fede52ac606ad83cfc534ca24b73915c5bdff', {
    host: 'ec2-184-72-238-22.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
    }
   });

var Employee = sequelize.define("Employee", {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.BOOLEAN,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define("Department",{
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

//this function opens the json files
module.exports.initialize = function(){
    return new Promise(function (resolve, reject){
        sequelize.sync() 
        .then(() =>{
            resolve("Database read completed successfully");
        })
        .catch(() =>{
            reject("File read failed");
        })
    });
}


//this function sends the employees array
module.exports.getAllEmployees = function (){
    return new Promise(function (resolve, reject){
        sequelize.sync()
        .then(() => resolve(Employee.findAll()))
        .catch(() => {reject("No results returned")})
    });
}

//this function returns the departments array
module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject){
        sequelize.sync()
        .then(() =>{
            resolve(Department.findAll())})
        .catch(() => {reject("No results returned")})
    });
}

module.exports.getEmployeeByNum = function (num){ 
    return new Promise(function (resolve, reject) { 
        Employee.findAll({ where:{employeeNum:num} }) 
        .then((data)=>{ resolve(data[0]); }) 
        .catch(()=>{ reject("no employee returned"); }) 
    }); 
} 

module.exports.addEmployee = function(employeeData){ 
    return new Promise(function (resolve, reject) { 
        employeeData.isManager = (employeeData.isManager) ? true : false; 
        for (var i in employeeData) { 
            if (employeeData[i] == "") {employeeData[i] = null;}
        }; 
        Employee.create({ 
            employeeNum: employeeData.employeeNum, 
            firstName: employeeData.firstName, 
            lastName: employeeData.lastName, 
            email: employeeData.email, 
            SSN: employeeData.SSN, 
            addressStreet: employeeData.addressStreet, 
            addressCity: employeeData.addressCity, 
            addressState: employeeData.addressState, 
            addressPostal: employeeData.addressPostal, 
            maritalStatus: employeeData.maritalStatus, 
            isManager: employeeData.isManager, 
            employeeManagerNum: employeeData.employeeManagerNum, 
            status: employeeData.status, 
            department: employeeData.department, 
            hireDate: employeeData.hireDate 
        }) 
        .then(()=>{ 
            console.log("successfully created a new employee"); 
            resolve(Employee[1]); 
        }) 
        .catch(()=>{ 
            reject("unable to create employee"); 
        });    
    }); 
}; 


//getEmployeesByStatus function
module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {resolve(Employee.findAll({where: {status: status}}))})
        .catch(() => {reject("No results returned")})
    });
}

//getEmployeesByDepartment function
module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {resolve(
            Employee.findAll({
                where: {department: [department]}
            })
        )})
        .catch(() => {reject("No results returned")})
    });
}

//getEmployeesByManager function
module.exports.getEmployeesByManager = (Manager) => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {resolve(
            Employee.findAll({
                where: {employeeManagerNum: [Manager]}
            })
        )})
        .catch(() => {reject("No results returned")})
    });
}

//getEmployeesByNum function
module.exports.getEmployeesByNum = (Num) => {
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {resolve(
            Employee.findAll({
                where: {employeeNum: [Num]}
            })
        )})
        .catch(() => {reject("No results returned")})
    });
}

//updateEmployee function
module.exports.updateEmployee = (employeeData) =>{
    return new Promise((resolve, reject)=>{
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(var i in employeeData){
            if(employeeData[i] == ""){
                employeeData[i] = null;
            }
        }
        sequelize.sync()
        .then(() => resolve(
            Employee.update({
                employeeNum: employeeData.employeeNum,
                firstname: employeeData.firstname,
                lastname: employeeData.lastname,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                maritalStatus: employeeData.maritalStatus,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate
            },{
                where: {employeeNum: employeeData.employeeNum}
            })
        ))
        .catch(() => {reject("unable to updateemployee")})
    });
}

//addDepartment function
module.exports.addDepartment = (departmentData) => { 
    return new Promise(function (resolve, reject) { 
        for (var i in departmentData) { 
            if (departmentData[i] == "") departmentData[i] = null; 
        }; 
        Department.create({ 
            departmentName: departmentData.departmentName 
        }) 
        .then(()=>{ 
            console.log("successfully created a new department"); 
            resolve(Department[1]); 
        }) 
        .catch(()=>{ 
            console.log("se fodeu");
            reject("unable to create department"); 
        });    
    }); 
} 

//updateDepartment function
module.exports.updateDepartment = (departmentData) =>{
    return new Promise ((resolve, reject) =>{
        for (var i in departmentData){
            if(departmentData[i] == ""){departmentData[i] = null;}
        }
        sequelize.sync().then(() =>{
            Department.update({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            },{
                where: {departmentId: departmentData.departmentId}
            })
        })
        .then(()=>{ resolve(Department); }) 
        .catch(() =>{ reject("Unable to update department")})
    })
}

module.exports.getDepartmentById = function (id){ 
    return new Promise(function (resolve, reject) { 
        Department.findAll({ 
            where:{departmentId:id} 
        }) 
        .then((data)=>{resolve(data);}) 
        .catch(()=>{reject("no department returned");}) 
    }); 
}



// deleteEmployeeByNum function
module.exports.deleteEmployeeByNum = ((empNum) => {
    return new Promise((resolve, reject) => {
            Employee.destroy({
                where: {employeeNum:empNum}
            })
            .then(() =>{resolve("Employee removed succesfully")})
            .catch(() =>{reject("Unable to remove")})
        })
})