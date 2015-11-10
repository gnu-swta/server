/**
 * Created by jeon on 15. 11. 6..
 */
var exec = require('child_process').exec;
var child;

// executes `phantomjs`
child = exec("./bin/phantomjs --ignore-ssl-errors=yes steptest.js", function (error, stdout, stderr) {
    undefined(stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
        return;
    }

    var classes = JSON.parse(stdout);
    console.log("Result is \n" + JSON.stringify(classes));
});
// or more concisely