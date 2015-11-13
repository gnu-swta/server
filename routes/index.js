var express = require('express');
var router = express.Router();

var login = require('./login');
var users = require('./users');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.use('/users', users);
router.post('/login/student', login.student);
router.post('/login/professor', login.professor);


module.exports = router;
