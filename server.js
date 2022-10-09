/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sidhant Sharma Student ID: 123151219 Date: 04, October 2022
*
* Your app’s URL (from Cyclic) : ______________________________________________
*
*************************************************************************/ 
var express = require("express");
var path = require("path");
var dataservice = require('./data-service.js');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
app.use(express.static('public'));

function onHTTPStart(){
    console.log('Express http server listening on '+ HTTP_PORT);
}

app.get("/", function(req, res)  {
    res.sendFile(path.join(__dirname, './views/home.html'));
});

app.get('/about', function(req, res)  {
    res.sendFile(path.join(__dirname, './views/about.html'));
});

//Employees
app.get('/employees', function(req, res){
dataservice.getAllEmployees().then((data)=>{
    res.json(data);
}
)});

// Managers
app.get('/managers', function(req, res){
    dataservice.getAllManagers().then((data)=>{
        res.json(data);
    }
    )});

// Department
app.get('/departments', function(req, res){
    dataservice.getAllDepartments().then((data)=>{
        res.json(data);
    }
    )});

// Here I have added a new error page which will show the 404 Error 
    app.use(function (req, res) {
        res.sendFile(path.join(__dirname,'/views/error.html'));
      });

dataservice
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, onHTTPStart);
  })
  .catch(function (err) {
    console.log('Failed to start!' + err);
  });
