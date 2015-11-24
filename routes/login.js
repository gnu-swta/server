/**
 * Created by jeon on 15. 11. 8..
 */

var mysql = require('../component/mysql/login');
var exec = require('child_process').exec;
var jwt = require('jsonwebtoken');
var child;

var login = {};

login.student = function (req, res) {
    var student = {};
    student.pk_student = req.body.student * 1;
    student.number = student.pk_student;
    var passwd = req.body.passwd;

    if ( !student.pk_student || !passwd )
    {
        console.log('error, empty value is not allowed');

        res.status(500).send({msg: "error, empty value is not allowed"});
        return;
    }

    // executes `phantomjs`
    child = exec("phantomjs --ignore-ssl-errors=yes ./steptest.js " + student.pk_student + " " + passwd, function (error, stdout, stderr) {
        if (stderr) {
            res.status(500);
            res.json(stderr);
            return;
        }
        if (error) {
            console.log('exec error: ' + error);
            return;
        }
        if (stdout === "") {
            console.log('error, return empty string from phantomjs');

            res.status(500).send({msg: "로그인할 수 없습니다"});
            return;
        }

        try {
            var returnJson = JSON.parse(stdout);
        }
        catch(e) {
            console.log("error : can't connecto to nis");

            res.status(500).send({msg: "can't connect to nis"});
            return;
        }

        if (returnJson.MST_ROW === null) {
            console.log("no info about ?", student.number);
            return;
        }

        var mst_list = returnJson.MST_LIST;
        student.name = returnJson.MST_ROW.nm;
        student.department = returnJson.MST_ROW.cls_nm;
        student.pk_student = returnJson.MST_ROW.student_no * 1;
        student.number = student.pk_student;

        mysql.student.login(function (err, classArr) {
            if (err) {
                console.log("error : can't send sql query");

                res.status(500).send({msg: "can't send sql query"});
                return;
            }

            var payload = {
                student: student,
                professor: null
            };

            var token = jwt.sign(payload, 'wpdjvks');
            var resSend = {
                jwt: token,
                classArr: classArr
            };
            res.send(resSend);
        }, student, mst_list);
        child.kill();
    });
};

login.professor = function (req, res)
{
    res.status(200);
    res.send('{msg:"아직 구현되지 않았습니다"}');
};

module.exports = login;
