/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Sidhant Sharma           Student ID: 123151219              Date: 25-11-2022
*
* Online (Heroku Cyclic) Link: https://calm-pink-bison-tutu.cyclic.app/
********************************************************************************/ 
var express = require('express');
var path = require('path');
var dataservice = require('./data-service.js');

var bodyParser = require('body-parser');
const multer = require("multer");
const exphbs = require('express-handlebars');
const fs = require('fs');

var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var HTTP_PORT = process.env.PORT || 8081;

function onHTTPStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
     
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });
 
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main",
runtimeOptions: {
  
    allowProtoPropertiesByDefault: true,  
    allowProtoMethodsByDefault: true,
},
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
app.use(express.static('public'));
app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
  });

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.render('about');
  });

  app.get('/employees/add', function(req, res) {
    dataservice.getDepartments().then((data)=>{
      res.render("addEmployee", {departments:data});
  }).catch((err)=>{
      res.render("addEmployee",{departments:[]});
  });
  });

  app.get('/images/add', function(req, res) {
    res.render('addImage');
  });

  app.get('/employees', function(req, res) {
    if(req.query.department){
      dataservice.getEmployeesByDepartment(req.query.department).then((dataservice) => {
        res.render("employees", dataservice.length>0?{employees:dataservice}:{message:"No results"});
        
    }).catch(err => res.render({message: "no results"}));

  } else if(req.query.employeeNum){ 
    dataservice.getEmployeeByNum(req.query.employeeNum).then((dataservice) => {
      res.render("employees", dataservice.length>0?{employees:dataservice}:{message:"No results"});})
      .catch(err => res.render({message: "no results"}));
    
  }
else if(req.query.manager){

  dataservice.getEmployeesByManager(req.query.manager).then((dataservice) => {
    res.render("employees", dataservice.length>0?{employees:dataservice}:{message:"No results"});
}).catch(err => res.render({message: "no results"}));

} else if(req.query.status){
  dataservice.getEmployeesByStatus(req.query.status).then((dataservice) => {
    res.render("employees", dataservice.length>0?{employees:dataservice}:{message:"No results"});
}).catch(err => res.render({message: "no results"}));
  
}else{ 
    dataservice.getAllEmployees().then((dataservice) => {
      res.render("employees", dataservice.length>0?{employees:dataservice}:{message:"No results"});
  }).catch(err => res.render({message: "no results"}));
 
 
}
  });

app.get("/images",function(req,res){
  fs.readdir("./public/images/uploaded", (err, items) => {
      for (var i=0; i<items.length; i++) {
      items[i];
  }
   
  return res.render("images",{images:items});  
    
    })
  

});

app.get("/employee/:empNum", (req, res) => {
  let viewData = {};
  dataService.getEmployeeByNum(req.params.empNum).then((data) => {
  if (data) {
  viewData.employee = data; 
  } else {
  viewData.employee = null; 
  }
  }).catch(() => {
  viewData.employee = null; 
  }).then(dataService.getDepartments)
  .then((data) => {
  viewData.departments = data; 
  "departments"

  for (let i = 0; i < viewData.departments.length; i++) {
  if (viewData.departments[i].departmentId == viewData.employee.department) {
  viewData.departments[i].selected = true;
  }
  }
  }).catch(() => {
  viewData.departments = []; 
  }).then(() => {
  if (viewData.employee == null) { 
  res.status(404).send("Employee Not Found");
  } else {
  res.render("employee", { viewData: viewData }); 
  }
  });
  });


app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });
  
  app.post("/employees/add", (req, res) => {
    dataservice.addEmployee(req.body).then((dataservice) =>{
        res.redirect("/employees");
    });

  })


  app.get("/employees/delete/:empNum",(req,res)=>{
    dataservice.deleteEmployeeByNum(req.params.empNum).then(()=>{
        redirect("/employees");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Employee / Employee not found")
    });
});

app.get('/managers', function(req, res) {
  dataservice.getManagers().then((dataservice) => {
    res.render("departments",dataservice.length>0?{departments:dataservice}:{message:"No results."})
});
});

app.get('/departments', function(req, res) {
  dataservice.getDepartments().then((dataservice) => {
    res.render("departments", {departments: dataservice});
}).catch(err => res.render({message: "no results"}));
});

app.post("/employee/update", (req, res) => { 
  dataservice.updateEmployee(req.body).then((dataservice) => {
    res.redirect("/employees");
    
}).catch(err => res.render({message: "no results"}));
});



app.get("/departments/add",(req,res)=>{
  res.render("addDepartment");
});

app.post("/departments/add", (req, res)=>{
  dataservice.addDepartment(req.body).then(()=>{
      res.redirect("/departments");
  }).catch((err)=>{
      res.status(500).send("Unable to add the deparmtment.");
  });
});

app.post("/department/update",(req,res)=>{
  dataservice.updateDepartment(req.body).then(()=>{
      res.redirect("/departments");
  }).catch((err)=>{
      res.status(500).send("Unable to update the department.");
  });
});

app.get("/department/:departmentId",(req,res)=>{
  dataservice.getDepartmentById(req.params.departmentId).then((data)=>{
      if (!data)
          {res.status(404).send("Department not found");}
      else
          {res.render("department",{department:data});}
  }).catch((err)=>{
      res.status(404).send("Department not found.");
  })
});

app.use(function (req, res) {
  res.sendFile(path.join(__dirname,'/views/error.html'));
});
dataservice.initialize().then(function(dataservice){
  app.listen(HTTP_PORT, function(){
      console.log("Express http server listening on " + HTTP_PORT)
  });
}).catch(function(err){
  console.log("Unable to start server: " + err);
});