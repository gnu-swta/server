/**
 * Created by jeon on 15. 11. 18..
 */
var mysql = require('../../component/mysql/report');
var express = require('express');
var router = express.Router();

router.get('/:fk_class', function (req,res) {
    var fk_class = req.params.fk_class;

    if (!fk_class) {
        console.log('error, invalid param');
        res.status(500).send({msg:"invalid param"});
        return;
    }

    mysql.getReportList(function(err, rows) {

    }, fk_class);
});

module.exports = router;