/*********************************************************************************
* BTI325 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Sidhant Sharma  Student ID: 123151219   Date:13-09-2022
*
* Online (Cyclic) URL: https://gold-lively-bee.cyclic.app/

* _______________________________________________________
*
********************************************************************************/ 

var express = require("express");
var path = require("path");
var dataservice = require('./data-service.js');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;



function onHTTPStart(){
    console.log('Express http server listening on '+ HTTP_PORT);
}

app.use(express.static('public'));
// setup a 'route' to listen on the default url path

app.get("/", function(req, res)  {
    res.sendFile(path.join(__dirname, './views/home.html'));
});

app.get('/about', function(req, res)  {
    res.sendFile(path.join(__dirname, './views/about.html'));
});

// setup http server to listen on HTTP_PORT
//app.listen(HTTP_PORT, onHTTPStart);

// route to setup employees
app.get('/employees', function(req, res){
dataservice.getAllEmloyess().then((data)=>{
    res.json(data);
}
)});

// route to setup Managers
app.get('/managers', function(req, res){
    dataservice.getAllManagers().then((data)=>{
        res.json(data);
    }
    )});


// route to setup Department
app.get('/departments', function(req, res){
    dataservice.getAllDepartments().then((data)=>{
        res.json(data);
    }
    )});


    app.use(function (req, res) {
        //res.status(404).send('Page Not Found');
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
