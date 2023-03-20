var port = process.env.PORT || 5005;
var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var bodyParser = require('body-parser');
const multiparty = require("multiparty");
const AWS = require('aws-sdk'); //TODO migrate to aws-sdk-v3
const dotenv = require("dotenv").config();
const fs = require('fs');

var app = express();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-west-1',
});

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
limit: '50mb',
extended: true
})); 

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

//Generate random string for file name
const makeRandom = () => {
  let rand = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 4; i++) {
    rand += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return rand;
}


//POST Request uploadImage
//Receives file, userid, description, file_name
//Uploads file to AWS S3 Bucket
//Saves file_name, description, userid, file_path to database

app.post('/api/uploadImage', function (req, res) {
  console.log("Upload Request");
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      res.status(400).send({ code: 400, message: "Failed to upload image", error: err });
    }

    try {
      var fields_list = Object.entries(fields);
      var files_list = Object.entries(files);
      var file = files_list[0][1][0];
      var file_name = fields_list[0][1][0];
      console.log(file_name);
      const file_content = fs.readFileSync(file.path);

      var description = fields_list[1][1][0];
      console.log(description);
      var Userid = fields_list[2][1][0];
      console.log(Userid);

      var rand = makeRandom();

      file_name = file_name + "-" + rand + ".jpg";

      var params = {
        Body: file_content,
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file_name
      };

      s3.upload(params, function (err, data) {
        if (err) {
          console.log(err);
          return res.status(400).send({ code: 400, message: "Failed to upload image", error: err });
        }
        else {
          //save file details to database
          con.query("INSERT INTO Uploads (file_name, description, Userid, file) VALUES (\"" + file_name + "\", \"" + description + "\", \"" + Userid + "\", \"" + data.Location + "\");",
            function (err, result) {
              if (err) {
                console.log(err);
                res.send({ code: 400, message: "Upload Failed Error" });
              } else {
                console.log("Result: " + JSON.stringify(result));
                console.log(result.insertId);
                if (result.insertId != 0) {
                  res.status(200).send({ code: 200, message: "Upload Successful" });
                } else {
                  res.status(400).send({ code: 400, message: "Upload Failed" });
                }

              }
            });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ code: 400, message: "Failed to upload image", error: err });
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
