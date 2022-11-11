var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ランニングコース' });
  res.render('index', { sample1: '/public/sample1.png' })
});

module.exports = router;
