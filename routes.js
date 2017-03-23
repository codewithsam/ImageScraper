const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res, next) => {
    res.render('index');
});


function callForImages(searchstring) {
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


router.post('/', (req, res, next) => {
    Promise.all(callForImages(req.body.searchstr))
        .then(([res1, res2]) => {
            let items1 = JSON.parse(res1);
            let items2 = JSON.parse(res2);
            let combinedresule = [...items1.items, ...items2.items];
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(combinedresule));
        }).catch(() => {
            console.log("Error requesting images");
        });
});

module.exports = router;