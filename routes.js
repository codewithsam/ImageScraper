const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');

router.get('/', (req, res, next) => {
    res.render('index');
});


// 
//      *****  BODY PARSER NOT WORKING!!!! CHECK THAT *****
// 

function callForImages(searchstring) {
    // console.log(searchstring);
    let uri1 = `https://www.googleapis.com/customsearch/v1?q=${searchstring}&searchType=image&fields=items(link)&start=1&key=AIzaSyAIctTMzhMQ8EKCxeL_x8vSD3QLlKWKQvY&cx=009581917276510476513:a_jchdnzqw8`;
    let uri2 = `https://www.googleapis.com/customsearch/v1?q=${searchstring}&searchType=image&fields=items(link)&start=11&num=5&key=AIzaSyAIctTMzhMQ8EKCxeL_x8vSD3QLlKWKQvY&cx=009581917276510476513:a_jchdnzqw8`;
    let p1 = new Promise((resolve, reject) => {
        request.get(uri1, (err, res, body) => {
            if (err) {
                reject();
            }
            resolve(body);
        });
    });
    let p2 = new Promise((resolve, reject) => {
        request.get(uri2, (err, res, body) => {
            if (err) {
                reject();
            }
            resolve(body);
        });
    });
    return [p1, p2];
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function downloadAllImages(imgarray) {
    let Promisearray = [];

    for (let links of imgarray) {
        let p = new Promise((resolve, reject) => {
            request(links.link)
                .pipe(fs.createWriteStream("./images/" + guid()))
                .on('error', reject)
                .on('close', resolve);
        });
        Promisearray.push(p);
    }
    return Promisearray;
    // request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    console.log(imgarray);
}




router.post('/', (req, res, next) => {
    console.log(req.body.searchstr);
    Promise.all(callForImages(req.body))
        .then(([res1, res2]) => {
            let items1 = JSON.parse(res1);
            let items2 = JSON.parse(res2);
            let combinedresule = [...items1.items, ...items2.items];
            Promise.all(downloadAllImages(combinedresule))
                .then(_ => {
                    console.log("Done!");
                }).catch((err) => {
                    console.log(err);
                });
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(combinedresule));
        }).catch(() => {
            console.log("Error requesting images");
        });
});

module.exports = router;