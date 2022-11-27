const fp = require('fs');


const Sequelize = require("sequelize");

var sequelize = new Sequelize('advmdxmb', 'advmdxmb', 'JhWDTMGSyBfkgsmbczhcsoZR-PGj0BS8', {
  host: 'heffalump.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialiectOptions: {ssl: {
    require: true,
    rejectUnauthorized: false
  }},
  });


sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));


// Database models
var Employee = sequelize.define("Employee", {
    employeeNum:{
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
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define("Department",{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});



module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(()=>{
      resolve();
  }).catch(()=>{
       reject("Unable to sync the database.");
  });
  });
};



module.exports.getAllEmployees = function () {
  return new Promise(function (resolve, reject) {
    Employee.findAll().then((data)=>{
      resolve(data);
  }).catch((err)=>{
      reject("No results returned.");
  });
    });
};



module.exports.getDepartments = function () {
  return new Promise(function (resolve, reject) {
    Department.findAll().then((data)=>{
      resolve(data);
  }).catch((err)=>{
      reject("no results returned")
  });
    });
};

// Adding "addEmployee" function within data-service.js
module.exports.addEmployee = function(employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager = (employeeData.isManager)?true:false;        
        for (let temp in employeeData)
            {
                if (employeeData[temp]=="")
                    employeeData[temp] = null;
            }
       
        Employee.create(employeeData).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("Unable to Create Employee");
        });
    });


}

module.exports.getEmployeesByStatus = function(sta) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where:{status:sta}
  }).then((data)=>{
      resolve(data);
  }).catch((err)=>{
      reject("no results returned");
  });
    });
}


module.exports.getEmployeesByDepartment = function(dep) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {department: dep}
  }).then((data)=>{
      resolve(data);
  }).catch((err)=>{
      reject("no results returned")
  });
    });

}

module.exports.getEmployeesByManager = function(manager) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where:{employeeManagerNum: manager}
  }).then((data)=>{
      resolve(data);
  }).catch((err)=>{
      reject("No results returned");
  });
    });

}


module.exports.getEmployeeByNum = function(num) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where:{employeeNum: value}
  }).then((data)=>{
      resolve(data[0]);
  }).catch((err)=>{
      reject("no results returned")
  });
    });

}

module.exports.deleteEmployeeByNum = function(empNum){
  return new Promise((resolve, reject)=>{
      Employee.destroy({
                      where: {employeeNum: empNum}
      }).then(()=>{
          resolve();
      }).catch((err)=>{
          reject("Unable to delete employee");
      });
  })
}


module.exports.updateEmployee = function(employeeData) {
  return new Promise(function (resolve, reject) {
    employeeData.isManager= employeeData.isManager?true:false;
        for (let temp in employeeData)
            {
                if (employeeData[temp]=="")
                    employeeData[temp]=null;
            }
        Employee.update(employeeData,
            {where: {employeeNum: employeeData.employeeNum}}
        ).then(()=>{
            resolve();
        }).catch((err)=>{
            reject("unable to update employee");
        });  
    });
}


module.exports.addDepartment= function(departmentData){
  return new Promise((resolve, reject)=>{
     for (let temp in departmentData)
         {
             if (departmentData[temp]=="")
                 departmentData[temp] = null;
         }
     Department.create(departmentData).then(()=>{
         resolve();
     }).catch((err)=>{ 
         reject("unable to create department");
     });
  });
}

module.exports.updateDepartment=function(departmentData){
  return new Promise((resolve, reject)=>{
      for (let temp in departmentData)
         {
             if (departmentData[temp]=="")
                 {
                     departmentData[temp] = null;
                 }
         }
     Department.update(departmentData,
     {where: {departmentId: departmentData.departmentId}})
     .then(()=>{
         resolve();
     }).catch((err)=>{
         reject("unable to update department");
     });
  });
}


module.exports.getDepartmentById=function(id){
  return new Promise((resolve, reject)=>{
      Department.findAll(
          {where: {departmentId: id}})
          .then((data)=>{
              resolve(data[0]);
          }).catch((err)=>{
              reject("unable to update department");
          });
  });
}

