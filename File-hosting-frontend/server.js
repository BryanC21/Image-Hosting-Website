var express = require('express');
var port = process.env.PORT || 3000;
var app = express(),
path = require('path'),
publicDir = path.join(__dirname,'myfrontend','build');

app.use(express.static(publicDir))

app.listen(port, () => {
    console.log('Frontend server is up');
});

module.exports = app;
