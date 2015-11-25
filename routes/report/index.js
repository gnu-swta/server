/**
 * Created by jeon on 15. 11. 18..
 */
var mysql = require('../../component/mysql/report');
var express = require('express');
var router = express.Router();
var submit = require('./submit.js');

router.use('/submit', submit);

router.get('/:fk_class', function (req,res) {
    var fk_class = req.params.fk_class;

    if (!fk_class) {
        console.log('error, invalid param');
        res.status(500).send({msg:"invalid param", fk_class:fk_class});
        return;
    }

    mysql.getReportList(function(err, rows) {
        if (err) {
            console.log("error : can't send sql query");
            console.log(err.sql);
            res.status(500).send({msg: "can't send sql query"});
            return;
        }

        res.status(200).send(rows);
    }, fk_class);
});

router.post('/', function (req,res) {
    var post = {};
    post.fk_class = req.body.fk_class;
    post.title = req.body.title;
    post.start = req.body.start;
    post.deadline = req.body.deadline;

    if (!post.fk_class || !post.title || !post.start || !post.deadline) {
        console.log('error, invalid params');
        console.log(post);
        res.status(500).send({msg:"invalid params", req:{body:req.body}});
        return;
    }

    mysql.postReport(function(err, rows) {
        if (err) {
            console.log("error : can't send sql query");
            console.log(err.sql);
            res.status(500).send({msg: "can't send sql query"});
            return;
        }

        res.status(200).send(rows);
    }, post);
});

module.exports = router;