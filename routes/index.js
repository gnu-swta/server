var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var login = require('./login');
var student = require('./student');
var professor = require('./professor');
var _class = require('./class');
var chat = require('./chat');
var report = require('./report');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* use student, professor listing. */
router.use('/student', jwt({secret: 'wpdjvks'}), student);
router.use('/professor', jwt({secret: 'wpdjvks'}), professor);

router.post('/login/student', login.student);
router.post('/login/professor', login.professor);

router.use('/class', jwt({secret: 'wpdjvks'}), _class);
router.use('/chat', jwt({secret: 'wpdjvks'}), chat);
//router.use('/report', jwt({secret: 'wpdjvks'}), report);
router.use('/report', report);


module.exports = router;
