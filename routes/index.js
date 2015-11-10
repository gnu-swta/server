var express = require('express');
var router = express.Router();

var login = require('./login');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login/student', login.student);
router.post('/login/professor', login.professor);

module.exports = router;
