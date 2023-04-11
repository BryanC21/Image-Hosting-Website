var express = require('express');
var port = process.env.PORT || 3011;
var app = express(),
    path = require('path'),
    publicDir = path.join(__dirname, 'myfrontend', 'build');

app.use(express.static(publicDir))

app.all('*', (req, res) => {
    res.sendFile(publicDir + '/index.html');
});


app.listen(port, () => {
    console.log('Frontend server is up');
});

module.exports = app;
