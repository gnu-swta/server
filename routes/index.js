var express = require('express');
var router = express.Router();

var login = require('./login');
var jwt = require('express-jwt');

var student = require('./student');
var professor = require('./professor');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* use student, professor listing. */
router.use('/student', jwt({secret: 'wpdjvks'}), student);
router.use('/professor', jwt({secret: 'wpdjvks'}), professor);

router.post('/login/student', login.student);
router.post('/login/professor', login.professor);


module.exports = router;
