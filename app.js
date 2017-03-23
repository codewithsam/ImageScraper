const express = require("express");
const app = express();
const http = require('http');
const routes = require('./routes');
http.createServer(app).listen(2000);

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(routes);