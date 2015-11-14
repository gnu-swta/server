/**
 * Created by jeon on 15. 11. 8..
 */
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var student = require('./student');
var professor = require('./professor');

/* use student, professor listing. */
router.use('/student', jwt({secret: 'wpdjvks'}), student);
router.use('/professor', jwt({secret: 'wpdjvks'}), professor);

module.exports = router;
