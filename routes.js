const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
let ImageDB = require('./schema/ImageSchema');



function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

router.get('/', (req, res, next) => {
        res.render('index');
});
router.get('/keywords', (req, res, next) => {
    ImageDB.find({},'payload', (err, result) => {
        res.render('keywords', {
            data: result
        });
    });
});

router.get('/keywords/:payload', (req,res,next)=>{
    ImageDB.find({
        payload: req.params.payload
    }, (err, result) => {
        if (err) console.log("error");
        else{
            res.render('result', {data: result[0].items});
        }
    });
});




function callForImages(searchstring) {
    let uri1 = `https://www.googleapis.com/customsearch/v1?q=${searchstring}&searchType=image&start=1&key=AIzaSyAQYnvfdqa0WJcNCHyy-c0UNWWxUCAaAX8&cx=009581917276510476513:a_jchdnzqw8`;
    let uri2 = `https://www.googleapis.com/customsearch/v1?q=${searchstring}&searchType=image&start=11&num=5&key=AIzaSyAQYnvfdqa0WJcNCHyy-c0UNWWxUCAaAX8&cx=009581917276510476513:a_jchdnzqw8`;
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
            console.log(body);
        });
    });
    return [p1, p2];
}






function downloadAllImages(imgarray) {
    let Promisearray = [];

    for (let links of imgarray) {
        let p = new Promise((resolve, reject) => {
            let mime = links.link.substring(links.link.lastIndexOf("."), links.link.length);


            request.get({
                url: links.link,
                encoding: 'binary'
            }, function (err, res, body) {
                if (err) reject();
                if (!err && res.statusCode === 200) {
                    let filename = "./images/" + guid() + mime;
                    fs.writeFile(filename, body, 'binary', _ => {
                        resolve(filename);
                    });
                }
            });
        });
        Promisearray.push(p);
    }
    return Promisearray;
}

function storeResult(payload,items){
    
}


router.post('/', (req, response, next) => {
   let ifExistPromise = new Promise((resolve,reject)=>{
       ImageDB.find({
           payload: req.body.searchstr
       }, (err, result) => {
           if(err) reject();
           resolve(result);
       });
   });


ifExistPromise.then((re)=>{
    console.log(re);
    if(re.length){
       response.redirect('/keywords/'+re[0].payload);
    }
    else{
        Promise.all(callForImages(req.body.searchstr))
        .then(([res1, res2]) => {
        let items1 = JSON.parse(res1);
        let items2 = JSON.parse(res2);
        let combinedresule = [...items1.items, ...items2.items];
        Promise.all(downloadAllImages(combinedresule))
            .then((filenames) => {
                console.log(filenames);
                storeResult(req.body.searchstr, filenames);
                let imgs = new ImageDB({
                    payload: req.body.searchstr,
                    items: filenames
                });
                imgs.save(function (err) {
                    if (err) console.log("Database error!");
                    else {
                        response.redirect('/keywords/' + req.body.searchstr);
                    }
                });

            }).catch((err) => {
                console.log(err);
            });

        })
        .catch((err) => {
            console.log(err);
        });
    }
}).catch((err)=>{
    console.log(err);
});


    
});

module.exports = router;