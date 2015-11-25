/**
 * Created by jeon on 15. 11. 16..
 */
var mysql = require('../../component/mysql/chat');
var express = require('express');
var router = express.Router();

function getChat(res, fk_class, fk_chat) {
    fk_chat = fk_chat ? fk_chat : 0;

    if (!fk_class) {
        console.log("error, Invaild params");
        res.status(500).send({"msg": "Invaild params"});
        return;
    }

    mysql.getChat(function (err, student) {
        if (err) {
            console.log("error : can't send sql query");
            console.log(err.sql);
            res.status(500).send({msg: "can't send sql query"});
            return;
        }

        res.status(200).send(student);
    }, fk_class, fk_chat);
}

router.get('/:fk_class/', function(req, res) {
    var fk_class = req.params.fk_class * 1;

    getChat(res, fk_class);
});

router.get('/:fk_class/:fk_chat', function(req, res) {
    var fk_class = req.params.fk_class * 1;
    var fk_chat = req.params.fk_chat * 1;

    getChat(res, fk_class, fk_chat);
});

router.post('/', function(req, res) {
    var fk_class = req.body.fk_class * 1;
    var student = req.user.student;
    var fk_chat = req.body.seq * 1;
    var msg = req.body.msg;

    if (!fk_class || !student || !msg) {
        console.log("error, Invaild params");
        res.status(500).send({"msg": "Invaild params"});
        return;
    }

    var post = {
        fk_class: fk_class,
        fk_student: student.fk_student,
        name : student.name,
        department : student.department,
        msg: msg
    };

    mysql.putChat(function (err, result) {
        if (err) {
            console.log("error : can't send sql query");
            console.log(err.sql);

            res.status(500).send({msg: "can't send sql query"});
            return;
        }

        res.status(200).send(result);
    }, post, fk_chat);
});

module.exports = router;