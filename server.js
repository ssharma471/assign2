/*************************************************************************
* BTI325– Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sidhant Sharma       Student ID: 123151219      Date: 25-10-2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* https://infinite-woodland-14729.herokuapp.com/
*
*************************************************************************/ 
var express = require("express");
var path = require("path");
var dataservice = require('./data-service.js');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
app.use(express.static('public'));

var body_Parser = require('body-parser');
const multer = require("multer");
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(body_Parser.urlencoded({ extended: true }));

function onHTTPStart() {
  console.log('Express http server listening on ' + HTTP_PORT);
}

// ADDING IMAGES
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {

    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, './views/home.html'));
});

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, './views/about.html'));
});

app.get('/employee/add', function (req, res) {
  res.sendFile(path.join(__dirname, './views/addEmployee.html'));
});

app.get('/images/add', function (req, res) {
  res.sendFile(path.join(__dirname, './views/addImage.html'));
});

//Employees
app.get('/employees', function (req, res) {
  if (req.query.department) {
    dataservice.getEmployeesByDepartment(req.query.department).then((dataservice) => {
      res.json(dataservice);
    });

  }
  else if (req.query.employeeNum) {
    dataservice.getEmployeeByNum(req.query.employeeNum).then((dataservice) => {
      res.json(dataservice);
    });
  }
  else if (req.query.status) {
    dataservice.getEmployeesByStatus(req.query.status).then((dataservice) => {
      res.json(dataservice);
    });
  }
  else if (req.query.manager) {
    dataservice.getEmployeesByManager(req.query.manager).then((dataservice) => {
      res.json(dataservice);
    });
  }

  else {
    dataservice.getAllEmployees().then((dataservice) => {
      res.json(dataservice);
    });

  }
});

app.get("/images", function (req, res) {
  fs.readdir("./public/images/uploaded", (err, items) => {
    for (let i = 0; i < items.length; i++) {
      items[i];
    }
    return res.json({ images: items });
  })

});

app.get("/employee/:empNum", (req, res) => {
  dataservice.getEmployeeByNum(req.params.empNum).then((dataservice) => {
    res.json(dataservice);
  });

});

//POST ROUTE (REDIREDT TO ROUTE /images)
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

//POST ROUTE (REDIREDT TO ROUTE /employees)
app.post("/employees/add", (req, res) => {
  dataservice.addEmployee(req.body).then((dataservice) =>{
      res.redirect("/employees");
  });

})
// Managers
app.get('/managers', function (req, res) {
  dataservice.getAllManagers().then((dataservice) => {
    res.json(dataservice);
  }
  )
});

// Department
app.get('/departments', function (req, res) {
  dataservice.getAllDepartments().then((dataservice) => {
    res.json(dataservice);
  }
  )
});

// Here I have added a new error page which will show the 404 Error 
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, '/views/error.html'));
});

dataservice
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, onHTTPStart);
  })
  .catch(function (err) {
    console.log('Failed to start!' + err);
  });
