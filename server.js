/*************************************************************************
* BTI325– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: ____________________________ Student ID: ______________ Date: _______
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* ______________________________________________
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
const exphbs = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(body_Parser.urlencoded({ extended: true }));

function onHTTPStart() {
  console.log('Express http server listening on ' + HTTP_PORT);
}


app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });

// ADDING IMAGES
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {

    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main",
helpers:{
  navLink: function(url, options){ 
  return '<li' +
      ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
      '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>'; 
}, equal: function (lvalue, rvalue, options) { 
  if (arguments.length < 3) 
      throw new Error("Handlebars Helper equal needs 2 parameters"); 
  if (lvalue != rvalue) { 
      return options.inverse(this); 
  } else { 
      return options.fn(this); 
  } 
}
}
}));

app.set('view engine', '.hbs');

// Route to listen on home using render
app.get('/', function(req, res){
  res.render('home');
});
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, './views/home.html'));
// });


app.get('/about', function(req, res){
  res.render('about');
});
// app.get('/about', function (req, res) {
//   res.sendFile(path.join(__dirname, './views/about.html'));
// });


app.get('/employees/add', function(req, res){
  res.render('addEmployee');
});
// app.get('/employee/add', function (req, res) {
//   res.sendFile(path.join(__dirname, './views/addEmployee.html'));
// });


app.get('/images/add', function(req, res){
  res.render('addImage');
});

// app.get('/images/add', function (req, res) {
//   res.sendFile(path.join(__dirname, './views/addImage.html'));
// });

//Employees
app.get('/employees', function (req, res) {
   if (req.query.employeeNum) {
    dataservice.getEmployeeByNum(req.query.employeeNum).then((dataservice) => {
      res.render("employees",{employees:dataservice});      
      //res.json(dataservice);
    }).catch(err=> res.render({message:"no results"}));
  }
  else if (req.query.department) {
    dataservice.getEmployeesByDepartment(req.query.department).then((dataservice) => {
      res.render("employees",{employees:dataservice});
     // res.json(dataservice);
    }).catch(err=> res.render({message:"no results"}));

  }
  else if (req.query.status) {
    dataservice.getEmployeesByStatus(req.query.status).then((dataservice) => {
      res.render("employees",{employees:dataservice});
      //  res.json(dataservice);
    }).catch(err=> res.render({message:"no results"}));
  }
  // else if (req.query.manager) {
  //   dataservice.getEmployeesByManager(req.query.manager).then((dataservice) => {
  //     res.render("employees",{employees:dataservice});
  //     //res.json(dataservice);
  //   }).catch(err=> res.render({message:"no results"}));
  // }

  else {
    dataservice.getAllEmployees().then((dataservice) => {
      res.render("employees",{employees:dataservice});

      //res.json(dataservice);
    }).catch(err=> res.render({message:"no results"}));

  }
});

app.get("/images", function (req, res) {
  fs.readdir("./public/images/uploaded", (err, items) => {
    for (let i = 0; i < items.length; i++) {
      items[i];
    }
    //res.json({ images: items });
    return res.render("images",{images:items});
  })

});

app.get("/employee/:empNum", (req, res) => {
  dataservice.getEmployeeByNum(req.params.empNum).then((dataservice) => {
    res.render("employee",{employee:dataservice});
    //res.json(dataservice);
  }).catch(err=> res.render({message:"no results"}));

});

// Managers
// app.get('/managers', function (req, res) {
//   dataservice.getAllManagers().then((dataservice) => {
//     res.json(dataservice);
//   }
//   )
// });

// Department
app.get('/departments', function (req, res) {
  dataservice.getAllDepartments().then((dataservice) => {
    res.render("departments",{departments:dataservice});
    //res.json(dataservice);
  }).catch(err=> res.render({message:"no results"}));
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

});
// app.post("/employee/update", (req, res) => {
//   console.log(req.body);
//   res.redirect("/employees");
//  });
app.post("/employee/update", (req, res) => { 
  dataservice.updateEmployee(req.body).then((dataservice) => {
    res.redirect("/employees");
    
}).catch(err => res.render({message: "no results"}));
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
