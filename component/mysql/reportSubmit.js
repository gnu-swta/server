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

                callback(null, rows[0].extension);
            });
        });
    },

    postSubmit : function(callback, post) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("INSERT INTO ReportSubmit SET ?", [post], function (err, rows) {
                if (err) {
                    err.sql = this.sql;
                    callback(err, null);
                    return;
                }

                callback(null, rows);
            });
        });
    }
};