var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
var data = {
          title:'ランニング',
          content: '/public/sample1.png'
        };
  res.render('index', data)
});

module.exports = router;
