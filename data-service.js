//Name: Sidhant Sharma Student ID: 123151219 Date: 07, November, 2022
// My classmates Samarth, Kush and my brother helped me in assignment 4 for recalling the concepts and made me understand the things in a better way 
const fp = require('fs');
let Emp = [], Dep = [], Man = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fp.readFile('./data/employees.json', (err, data) => {
      if (err) {
        reject("unable to read file");
      }
      Emp = JSON.parse(data) ; 
      resolve();
    });

    fp.readFile('./data/departments.json', (err, data) => {
      if (err) {
        reject("unable to read file");
      }
      Dep = JSON.parse(data);
      resolve();
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (Emp.length > 0) {

      resolve(Emp);

    }
    reject('No Employee Found!');

  });
};



// module.exports.getAllManagers = function () {
//   return new Promise((resolve, reject) => {

//     for (let i = 0; i < Emp.length; i++) {
//       if (Emp[i].isManager == true)
//         Man.push(Emp[i]);


//     }

//     if (Man.length > 0) {
//       resolve(Emp);
//     }

//     reject('No Managers Found!');

//   });
// };

module.exports.getAllDepartments = function () {
  return new Promise((resolve, reject) => {

    if (Dep.length > 0) {

      resolve(Dep);

    }
    reject('No Department Found!');
  });
};

module.exports.addEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    if (employeeData.isManager == undefined) {
      employeeData.isManager = false;
    }
    else {
      employeeData.isManager = true;
    }
    employeeData.employeeNum = Emp.length + 1;
    Emp.push(employeeData);
    resolve(Emp);
  });
}

module.exports.getEmployeesByStatus = function(status) {
  return new Promise((resolve, reject)=> {
    let vals = [];
    for (let i= 0; i < Emp.length; i++) {
      if (Emp[i].status == status) {
        vals.push(Emp[i]);
      }
    }
  if (Emp.length == 0) {
    reject("no results returned");
  }
  resolve(vals);
  });
}

module.exports.getEmployeesByDepartment = function(department) {
  return new Promise((resolve, reject)=> {
    let vals = [];
    for (let i= 0; i < Emp.length; i++) {
      if (Emp[i].department == department) {
        vals.push(Emp[i]);
      }
    }
  
  if (Emp.length == 0) 
  {
    reject("no results returned");
  }
  resolve(vals);
  });

}

// module.exports.getEmployeesByManager = function(manager) {
//   return new Promise((resolve, reject)=> {
//     let vals = [];
//     for (let i= 0; i < Emp.length; i++) {
//       if (Emp[i].employeeManagerNum == manager) {
//         vals.push(Emp[i]);
//       }
//     }
  
//   if (Emp.length == 0) {
//     reject("no results returned");
//   }
//   resolve(vals);
    
//   });

// }

module.exports.getEmployeeByNum = function(num) {
  return new Promise((resolve, reject)=> {
    let vals = [];
    for (let i= 0; i < Emp.length; i++) {
      if (Emp[i].employeeNum == num) {
        vals.push(Emp[i]);
      }
    }
  
  if (Emp.length == 0) {
    reject("no results returned");
  }
  resolve(vals);
    
  });

}



module.exports.updateEmployee = function(employeeData) {
  return new Promise((resolve, reject)=> {
    let x = false;
    for (let i= 0; i < Emp.length; i++) {
      if (Emp[i].SSN == employeeData.SSN) {
        Emp[i] = employeeData;
        Emp[i].employeeNum= i + 1;
          x = true;
      }
    }

    if (x == false){
      reject("Data Not found");
    } else{
      resolve();
    }
  

  });
}