/**
 * Created by jeon on 15. 11. 11..
 */
var mysql = require('mysql');
var pool = mysql.createPool(require('../../config/mysql'));

module.exports = {
    getReportList : function (callback, fk_class) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("SELECT * FROM Report WHERE fk_class=?", [fk_class], function (err, rows) {
                if (err) {
                    console.log("sql : " + this.sql);
                    callback(err, null);
                    return;
                }
                callback(null, rows);
            });
        });
    },

    makeReport : function(callback, post, fk_chat) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            connection.query("INSERT INTO Chat SET ?", [post], function (err) {
                if (err) {
                    console.log("sql : " + this.sql);
                    callback(err, null);
                    return;
                }

                _getChat (callback, post.fk_class, fk_chat);
            });
        });
    }
};