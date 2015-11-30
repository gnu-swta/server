/**
 * Created by jeon on 15. 11. 11..
 */
var mysql = require('mysql');
var pool = mysql.createPool(require('../../config/mysql'));

function _getChat (callback, fk_class, fk_chat) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null);
            return;
        }

        fk_chat = fk_chat ? fk_chat : 0;

        connection.query("SELECT * FROM Chat WHERE fk_class=? AND pk_chat >= ?", [fk_class, fk_chat], function (err, rows) {
            if (err) {
                console.log("sql : " + this.sql);
                err.sql = this.sql;
                callback(err, null);
                return;
            }
            callback(null, rows);
        });

        connection.release();
    });
}

module.exports = {
    getChat : _getChat,

    putChat : function(callback, post, fk_chat) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
                return;
            }

            post.time = new Date();

            connection.query("INSERT INTO Chat SET ?", [post], function (err) {
                if (err) {
                    console.log("sql : " + this.sql);
                    err.sql = this.sql;
                    callback(err, null);
                    return;
                }

                _getChat (callback, post.fk_class, fk_chat);

            });

            connection.release();
        });
    }
};