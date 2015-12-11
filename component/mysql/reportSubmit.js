/**
 * Created by jeon on 15. 11. 11..
 */
var mysql = require('mysql');
var pool = mysql.createPool(require('../../config/mysql'));

module.exports = {
    getSubmitList : function (callback, fk_report) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("SELECT * FROM ReportSubmit WHERE fk_report=?", [fk_report], function (err, rows) {
                if (err) {
                    err.sql = this.sql;
                    callback(err, null);
                    return;
                }

                callback(null, rows);
            });
            connection.release();
        });
    },

    getExtension : function (callback, fk_report, fk_student) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("SELECT extension FROM ReportSubmit WHERE fk_report=? AND fk_student=?", [fk_report, fk_student], function (err, rows) {
                if (err) {
                    err.sql = this.sql;
                    callback(err, null);
                    return;
                }

                if(rows.length == 0)
                    callback(null, null);
                else
                    callback(null, rows[0].extension);

            });
            connection.release();
        });
    },

    postSubmit : function(callback, post) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("REPLACE INTO ReportSubmit SET ?", [post], function (err, rows) {
                if (err) {
                    err.sql = this.sql;
                    callback(err, null);
                    return;
                }

                callback(null, rows);
            });
            connection.release();
        });
    },

    openFile : function(callback, fk_class, fk_student) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("UPDATE ReportSubmit SET ? WHERE fk_report=? AND fk_student=?", [{opened : true}, fk_class, fk_student], function (err, rows) {
                if (err) {
                    err.sql = this.sql;
                    callback(err, null);
                    return;
                }

                callback(null, rows);
            });
            connection.release();
        });
    }
};