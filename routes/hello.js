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
          res.render('hello/index',data)
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

const {check, validationResult } = require('express-validator')

router.get('/add',(req,res,next) => {
  var data = {
      title: 'hello/Add',
      content: '新しいレコードを入力',
      form: {name:'',mail:'',age:0}
  }
  res.render('hello/add', data);
})

router.post('/add', [
  check('name','NMAE入力').notEmpty(),
  check('mail','MAIL入力').isEmail(),
  check('age','AGE入力').isInt()
], (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    var result = '<ul class="text-danger">'
    var result_arr = errors.array()
    for(var n in result_arr) {
    result += '<li>' + result_arr[n].msg + '</li>'
  }
  result += '</ul>'
  var data = {
    title: 'hello/add',
    content: result,
    form: req.body
  }
  res.render('hello/add',data);
} else {

  var nm = req.body.name;
  var ml = req.body.mail;
  var ag = req.body.age;
  db.serialize(() => {
    db.run('insert into mydata (name,mail,age) values(?,?,?)',
    nm,ml,ag)
  })
  res.redirect('/hello')
}
})

router.get('/show',(req,res,next) => {
  const id = req.query.id;
  db.serialize(() => {
    const q ="select * from mydata where id = ?"
    db.get(q,[id],(err,row) => {
      if(!err) {
        var data = {
          title: 'Hello/show',
          content:'id = ' + id + ' レコード',
          mydata: row
        }
        res.render('hello/show',data)
      }
    })
  })
})

router.get('/edit',(req,res,next) => {
  const id = req.query.id
  db.serialize(() => {
    const q ="select * from mydata where id = ?"
    db.get(q, [id],(err,row) => {
      if (!err){
        var data = {
          title:'hello/edit',
          content:'id = ' + id + 'レコードの編集',
          mydata:row
        }
        res.render('hello/edit',data)
      }
    })
  })
})

router.post('/edit', (req,res,next) => {
  const id = req.body.id
  const nm = req.body.name
  const ml = req.body.mail
  const ag = req.body.age
  const q = "update mydata set name = ? , mail= ?, age= ? where id = ?";
  db.serialize(() => {
    db.run(q, nm, ml, ag, id)
  })
  res.redirect('/hello');
});

router.get('/delete',(req,res,next)=>{
  const id =req.query.id;
  db.serialize(() => {
    const q = "select * from mydata where id = ?"
    db.get(q, [id],(err,row) =>{
    if(!err){
      var data = {
        title: 'hello/Delete',
        content:'id = '+ id + 'レコードの削除',
        mydata: row
      }
      res.render('hello/delete',data)
    }
    })
  })
})

router.post('/delete', (req,res, next) =>{
  var id = req.body.id
  console.log(id)
  db.serialize(() => {
    const q = "delete from mydata where id = ?";
    db.run(q,id)
  })
  res.redirect('/hello')
})


router.get('/find' , (req, res ,next) => {
  db.serialize(() => {
    db.all("select * from mydata",(err, rows) => {
      if(!err) {
        var data = {
          title: 'hello/find',
          find:'',
          content:'検索条件',
          mydata: rows
        }
        res.render('hello/find',data)
      }
    })
  })
})

router.post('/find',(req, res,next) => {
  var find = req.body.find;
  db.serialize(() => {
    var q = "select * from mydata where ";
    db.all(q +find, [], (err,rows ) => {
    if(!err) {
    var data = {
      title: 'hello/find',
      find: find,
      content: '検索条件' + find,
      mydata: rows
    }
    res.render('hello/find',data)
  }
  })
})
})

module.exports = router;

