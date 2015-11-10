/**
 * Created by jeon on 15. 11. 8..
 */

var mysql = require('mysql');
var pool = mysql.createPool(require('../config/mysql'));
var exec = require('child_process').exec;
var child;

var login = {};

login.student = function (req, res, next)
{
    // executes `phantomjs`
    child = exec("phantomjs --ignore-ssl-errors=yes ./steptest.js", function (error, stdout, stderr) {
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
            console.log('return empty string from phantomjs');

            res.status(500).send({msg: "로그인할 수 없습니다"});
            return;
        }
        var returnJson = JSON.parse(stdout);
        var mst_list = returnJson.MST_LIST;
        var classArr = [];
        var student = {};

        student.name = returnJson.MST_ROW.nm;
        student.department = returnJson.MST_ROW.cls_nm;
        student.pk_student = returnJson.MST_ROW.student_no * 1;
        student.number = student.pk_student;

        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("error : can't get sql connection");
                console.log(err);

                res.status(500).send({msg: "can't get sql connection"});
                return;

            }

            // 로그인한 학생의 수강정보를 초기화합니다
            // 로그인한 학생의 정보를 저장함 (있으면 무시)
            connection.query("DELETE FROM student_class_register WHERE `fk_student`=?;"
                            +"INSERT IGNORE INTO student SET ?", [student.pk_student, student], function (err, rows) {
                if (err) {
                    console.log("error : can't send sql query");
                    console.log(err);

                    return;
                }
            });

            mst_list.forEach(function (e) {
                var pk_class;

                // 수업정보를 class table에 넣습니다. (있으면 무시)
                var post = {
                    code: e.subject_cd,
                    group: e.sg_ban_no * 1,
                    name: e.subject_nm,
                    classTime: e.time_table,
                    professor: e.prof_nm
                };

                connection.query("INSERT IGNORE INTO class SET ?; "
                                +"SELECT pk_class FROM class "
                                +"WHERE `code`=? AND `group`=?;", [post, e.subject_cd, e.sg_ban_no*1], function (err, rows) {
                    if (err) {
                        console.log("error : can't send sql query");
                        connection.release();

                        res.status(500).send({msg: "can't send sql query"});
                        return;
                    }

                    pk_class = rows[1][0].pk_class;
                    classArr.push(pk_class);

                    // student_class_lecture table을 갱신합니다.
                    return connection.query("INSERT IGNORE INTO student_class_register SET ?"
                        , {fk_student: student.pk_student, fk_class: pk_class}, function (err, rows) {
                            if (err) {
                                console.log("error : can't send sql query");
                                console.log(err);
                                return;
                            }
                        });
                });
            });

            // out of forEach
            console.log('out of forEach');
            console.log('classArr is ' + classArr);
            res.json(classArr);
            connection.release();
        });
    });
};

login.professor = function (req, res, next)
{
    res.status(200);
    res.send('{msg:"아직 구현되지 않았습니다"}');
};

module.exports = login;
