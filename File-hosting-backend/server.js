var port = process.env.PORT || 5005;
var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var bodyParser = require('body-parser');
const dotenv = require("dotenv").config();

var app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

//Upload file to AWS S3 Bucket

//POST Request LogIn
app.post('/api/login', (req, res) => {
  console.log("Login Request");
  console.log(JSON.stringify(req.body));
  let username = req.body.username;
  let password = req.body.password;
  con.query("SELECT * from Users WHERE username = \"" + username + "\" AND password = \"" + password + "\";",
    function (err, result) {
      if (err) {
        console.log(err);
        res.send({ code: 404, message: "Incorrect Username or Password" });
      } else {
        console.log("Result: " + JSON.stringify(result));
        if (result.length == 0) {
          res.send({ code: 404, message: "Incorrect Username or Password" });
        } else {
          if (result[0].Userid == 1) {
            res.send({ code: 200, message: "ADMIN", userid: result[0].Userid });
          } else {
            res.send({ code: 200, message: "Login Successful", userid: result[0].Userid });
          }
        }
      }
    });
});

//POST Request SignUp
app.post('/api/signup', function (req, res) {
  console.log("SignUp Request");
  console.log(JSON.stringify(req.body));
  let username = req.body.username;
  let password = req.body.password;
  con.query("INSERT INTO Users (username, password) VALUES (\"" + username + "\", \"" + password + "\");",
    function (err, result) {
      if (err) {
        console.log(err);
        res.send({ code: 400, message: "Signup Failed. Username taken!" });
      } else {
        console.log("Result: " + JSON.stringify(result));
        console.log(result.insertId);
        if (result.insertId != 0) {
          res.send({ code: 200, message: "Signup Successful" });
        } else {
          res.send({ code: 400, message: "Signup Failed" });
        }

      }
    });
});

//POST Request uploadImageData
app.post('/api/uploadImageData', function (req, res) {
  console.log("Upload Request");
  console.log(JSON.stringify(req.body));
  let file_name = req.body.file_name;
  let description = req.body.description;
  let Userid = req.body.Userid;
  let file = req.body.file;
  con.query("INSERT INTO Uploads (file_name, description, Userid, file) VALUES (\"" + file_name + "\", \"" + description + "\", " + Userid + ", \"" + file + "\");",
    function (err, result) {
      if (err) {
        console.log(err);
        res.send({ code: 400, message: "Upload Failed Error" });
      } else {
        console.log("Result: " + JSON.stringify(result));
        console.log(result.insertId);
        if (result.insertId != 0) {
          res.send({ code: 200, message: "Upload Successful" });
        } else {
          res.send({ code: 400, message: "Upload Failed" });
        }

      }
    });
});

//GET Request getImageData(UserID) Returns array of all images uploaded by user
app.get('/api/getImageData', function (req, res) {
  let id = req.query.userid;
  if (id == 1) { //Admin privilages
    con.query("SELECT * from Uploads;",
      function (err, result) {
        if (err) {
          console.log(err);
          res.send({ code: 400, message: "Failed Lookup" });
        } else {
          console.log("Result: " + JSON.stringify(result));

          if (result.length !== 0) {
            res.send({ code: 200, message: "Admin Lookup Successful", data: result });
          } else {
            res.send({ code: 400, message: "Admin Lookup Failed or Empty" });
          }

        }
      });
  } else {
    con.query("SELECT * from Uploads WHERE Userid = \"" + id + "\";",
      function (err, result) {
        if (err) {
          console.log(err);
          res.send({ code: 400, message: "Failed Lookup" });
        } else {
          console.log("Result: " + JSON.stringify(result));

          if (result.length !== 0) {
            res.send({ code: 200, message: "Lookup Successful", data: result });
          } else {
            res.send({ code: 400, message: "Lookup Failed or Empty" });
          }

        }
      });
  }
});

//POST Request updateImageData
app.post('/api/updateImageData', function (req, res) {
  console.log("Update Request");
  console.log(JSON.stringify(req.body));
  let file_name = req.body.firstName;
  let description = req.body.description;
  let id = req.body.id;
  con.query("UPDATE Uploads SET firstName = \"" + file_name + "\", description = \"" + description + "\" WHERE Uploadid = " + id + ";",
    function (err, result) {
      if (err) {
        console.log(err);
        res.send({ code: 400, message: "Update Failed Error" });
      } else {
        console.log("Result: " + JSON.stringify(result));
        if (result.affectedRows != 0) {
          res.send({ code: 200, message: "Update Successful" });
        } else {
          res.send({ code: 400, message: "Update Failed" });
        }

      }
    });
});

//GET Request deleteImageData
app.get('/api/deleteImageData', function (req, res) {
  let id = req.query.id;
  con.query("DELETE FROM Uploads WHERE Uploadid = " + id + ";",
    function (err, result) {
      if (err) {
        console.log(err);
        res.send({ code: 400, message: "Delete Failed Error" });
      } else {
        console.log("Result: " + JSON.stringify(result));
        if (result.affectedRows != 0) {
          res.send({ code: 200, message: "Delete Successful" });
        } else {
          res.send({ code: 400, message: "Delete Failed" });
        }

      }
    });
});

//Defaults
app.get('/api', function (req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.post('/api', function (req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

app.get("*", function (req, res) {
  res.send({
    "Output": "Hello World!"
  });
});

//Server start
app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

module.exports = app;
