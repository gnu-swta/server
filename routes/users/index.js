/**
 * Created by jeon on 15. 11. 8..
 */
var express = require('express');
var router = express.Router();

var student = require('./student');
var professor = require('./professor');

/* use student, professor listing. */
router.use('/student', student);

module.exports = router;
