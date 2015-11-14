/**
 * Created by jeon on 15. 11. 11..
 */
var mysql = require('mysql');
var pool = mysql.createPool(require('../../config/mysql'));


module.exports = {
    getStudent : function(callback, fk_student) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("SELECT * FROM Student WHERE pk_student=?", [fk_student], function (err, rows) {
                if (err) {
                    console.log("sql : " + this.sql);
                    callback(err, null);
                    return;
                }
                callback(null, rows[0]);
            });
        });
    },
    getProfessor : function(callback, fk_professor) {
        callback(null, "구현중입니다.");
    }
};