/**
 * Created by jeon on 15. 11. 8..
 */
var mysql = require('../../component/mysql/users');
var express = require('express');
var router = express.Router();

router.get('/:fk_student', function(req, res) {
    var fk_student = req.params.fk_student;

    mysql.getStudent(function(err, student) {
        if (err) {
            console.log("error : can't send sql query");

            res.status(500).send({msg: "can't send sql query"});
            return;
        }

        res.status(200).send(student);
    }, fk_student);

});

module.exports = router;