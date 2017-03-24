const express = require("express");
const app = express();
const http = require('http');
const routes = require('./routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
let ImageDB = require('./schema/ImageSchema');
mongoose.connect('mongodb://codewithsam:qazwsxedc@ds141490.mlab.com:41490/imagescraper');


// let football = new ImageDB({
//     payload: "football",
//     items: [{
//         original: "a",
//         small: "b",
//         medium: "c",
//         greyscale: "d"
//     }]
// });

// football.save(function (err) {
//     if (err) throw err;

//     console.log('Payload saved successfully!');
// });

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(routes);

http.createServer(app).listen(2000);
app.use(bodyParser.urlencoded({
    extended: true
}));