/**
 * Created by jeon on 15. 11. 11..
 */
var mysql = require('mysql');
var pool = mysql.createPool(require('../../config/mysql'));


module.exports.student = {
    login: function (callback, student, mst_list) {
        var isError = false;

        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            var classArr = [];

            // 로그인한 학생의 수강정보를 초기화합니다
            // 로그인한 학생의 정보를 저장함 (있으면 무시)
            connection.query("DELETE FROM Student_Class_register WHERE `fk_student`=?;"
                + "INSERT IGNORE INTO Student SET ?", [student.pk_student, student], function (err, rows) {
                if (err) {
                    console.log("sql : " + this.sql);
                    err.sql = this.sql;
                    callback(err, null);
                    isError = true;
                }


                function eachQuering(callback, student, post, e) {
                    connection.query("INSERT IGNORE INTO Class SET ?; "
                        + "SELECT pk_class FROM Class "
                        + "WHERE `code`=? AND `group`=?;", [post, e.subject_cd, e.sg_ban_no * 1], function (err, rows) {
                        if (err) {
                            console.log("sql : " + this.sql);
                            err.sql = this.sql;
                            callback(err, null);
                            return;
                        }

                        var pk_class = rows[1][0].pk_class;
                        callback(null, pk_class);

                        // student_class_lecture table을 갱신합니다.
                        connection.query("INSERT IGNORE INTO Student_Class_register SET ?"
                            , {fk_student: student.pk_student, fk_class: pk_class});
                    });
                }

                mst_list.forEach(function (e) {
                    if (isError) return;

                    // 수업정보를 class table에 넣습니다. (있으면 무시)
                    var post = {
                        code: e.subject_cd,
                        group: e.sg_ban_no * 1,
                        name: e.subject_nm,
                        classTime: e.time_table,
                        professor: e.prof_nm
                    };

                    eachQuering(function (err, pk_class) {
                        if (isError) return;
                        if (err) {
                            console.log("sql : " + this.sql);
                            isError = true;
                            callback(err, null);
                            connection.release();
                            return;
                        }

                        classArr.push({
                            pk_class: pk_class,
                            name: post.name,
                            group: post.group,
                            classTime: post.classTime
                        });

                        if (classArr.length === mst_list.length) {
                            callback(null, classArr);
                            connection.release();
                        }

                    }, student, post, e);
                });
            });
        });
    }
};

module.exports.professor = {
    login : function (callback, professor) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("SELECT c.* FROM `Professor_Class_lecture` p, `Class` c "
                        +"WHERE c.pk_class = p.fk_class AND p.fk_professor=?;", [professor], function (err, rows) {
                if (err) {
                    console.log("sql : " + this.sql);
                    err.sql = this.sql;
                    callback(err, null);
                    connection.release();
                    return;
                }

                callback(null, rows);
                connection.release();
            });
        });
    }
}