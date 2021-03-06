const express = require("express");
const app = express();
const http = require('http');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let ImageDB = require('./schema/ImageSchema');
mongoose.connect('mongodb://codewithsam:qazwsxedc@ds141490.mlab.com:41490/imagescraper');

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(routes);


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/'));
app.set('view engine', 'ejs');



app.listen(app.get('port'));