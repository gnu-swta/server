/**
 * Created by jeon on 15. 11. 18..
 */
var mysql = require('../../component/mysql/reportSubmit');
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/list/:fk_report', function (req,res) {
    var fk_report = req.params.fk_report;

    if (!fk_report) {
        console.log('error, invalid param');
        res.status(500).send({msg:"invalid param", fk_report:fk_report});
        return;
    }

    mysql.getSubmitList(function(err, rows) {
        if (err) {
            console.log("error : can't send sql query");
            console.log(err.sql);
            res.status(500).send({msg: "can't send sql query"});
            return;
        }

        res.status(200).send(rows);
    }, fk_report);
});

router.get('/file/:fk_report/:fk_student.:extension', function (req, res) {
    var fk_report = req.params.fk_report;
    var fk_student = req.params.fk_student;
    var extension = req.params.extension;

    var filePath = 'uploaded/report/'
        + fk_report + '/'
        + fk_student + '.' + extension;

    if (fs.existsSync(filePath)) {
        res.sendfile(filePath);
    }
    else {
        res.statusCode = 404;
        res.write('404 sorry not found');
        res.end();
    }
});

router.get('/file/:fk_report/:fk_student', function (req, res) {
    var fk_report = req.params.fk_report;
    var fk_student = req.params.fk_student;

    mysql.getExtension(function(err, extension) {
        res.redirect(req.originalUrl+'.'+extension);
    }, fk_report, fk_student);

});

router.post('/', function (req,res) {
    var post = {};
    post.fk_student = req.user.student.pk_student;
    post.fk_report = req.body.fk_report;

    if (!post.fk_student) {
        console.log('error, invalid user');
        console.log(post);
        res.status(500).send({msg:"invalid user"});
        return;
    }

    if (!post.fk_report) {
        console.log('error, invalid params');
        console.log(post);
        res.status(500).send({msg:"invalid params", req:{body:req.body}});
        return;
    }

    if (!req.files.file) {
        console.log('error, invalid file');
        console.log(post);
        res.status(500).send({msg:"invalid file"});
        return;
    }

    fs.readFile(req.files.file.path,function(error,data){
        var extension = req.files.file.name.split('.');
        extension = extension[extension.length-1];
        post.extension = extension;

        var destination = 'uploaded/report/'
            +post.fk_report+'/'
            +post.fk_student+'.'+extension;


        fs.writeFile(destination, data, function(error) {
            if (error) {
                console.log(error);

                res.status(500).send({msg: "can't save the file"});
            }

            mysql.postSubmit(function (err, result) {
                if (err) {
                    console.log("error : can't send sql query");
                    console.log(err.sql);
                    res.status(500).send({msg: "can't send sql query"});
                    return;
                }

                res.send(result);
            }, post);

        });
    });

});

module.exports = router;