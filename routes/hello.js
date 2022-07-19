const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');

const db =new sqlite3.Database('mydb.sqlite3')
// const http = require('https')
// const parseString = require('xml2js').parseString;


/* GET home page. */
// router.get('/',(req, res, next) => {
//   var msg = '何か書いて';
//   if (req.session.message !=undefined){
//     msg = "last Message" + req.session.message;
//   }
//   var data = {
//     title:'hello!!',
//     content: msg
//   };
//   res.render('hello', data);
// });
// router.get('/',(req, res, next) => {
//   var opt = {
//     host:'news.google.com',
//     port: 443,
//     path: '/rss?hl=ja&ie=UTF-8&oe=UTF-8&gl=JP&ceid=JP:ja'
//   };
//   http.get(opt,(res2) => {
//     var body =''
//     res2.on('data',(data)=> {
//       body += data;
//     });
//     res2.on('end',() => {
//       parseString(body.trim(),(err,result) => {
//         console.log(result);
//         var data = {
//           title:'google news2',
//           content: result.rss.channel[0].item
//         };
//         res.render('hello', data);
//       })
//     })
//   })
// });
router.get('/',(req, res, next) => {
 
    db.serialize(() => {
      var rows = "";

      db.each("select * from mydata",(err,row) => {
        if (!err){
          rows += "<tr><th>" + row.id + "</th><td>"
          + row.name + "</td><td></tr>";
        }
      }, (err, count) => {
        if (!err) {
          var data = {
            title: 'Hello',
            content: rows
          };
          res.render('hello',data)
        }
      })
    })
});

// router.post('/post',(req,res,next) => {
//   var msg =req.body['message'];
//   req.session.message = msg;
//   var data = {
//     title: 'hello',
//     content: 'あなたは'+ msg + '送りました' + req.session.message
//   };
//   res.render('hello',data);
  
// })
module.exports = router;