'use strict';

const supertest = require('supertest'); 
const test = require('unit.js');
const app = require('../server.js');

const request = supertest(app);

describe('Tests app', function() {
  it('verifies get', function(done) {
    request.get('/').expect(200).end(function(err, result) {
        test.string(result.body.Output).contains('Hello');
        test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
  it('verifies post', function(done) {
    request.post('/').expect(200).end(function(err, result) {
        test.string(result.body.Output).contains('Hello');
        test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
        done(err);
    });
  });
});

//Test Connection to Database
/*
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * from Users;", function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
  });
});
*/
