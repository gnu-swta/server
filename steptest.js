/**
 * Created by jeon on 15. 11. 5..
 */
var page = new WebPage(),
    testindex = 0,
    loadInProgress = false,
    setText = false;

page.onConsoleMessage = function() {
    page.render("./capture/step_" + testindex + ".png");
};

page.onLoadStarted = function() {
    loadInProgress = true;
    //console.log("load started");
};

page.onLoadFinished = function() {
    loadInProgress = false;
    //console.log("load finished");
};

function removeNull(object)
{
    for (var key in object)
    {
        if(typeof object[key] == "object" && object.hasOwnProperty(key))
            object[key] = removeNull(object[key]);

        if(object[key] == "" && object.hasOwnProperty(key))
            delete object[key];
    }
    return object;
}

var steps = [
    function() {
        //Load Login Page
        page.open("https://nis.gnu.ac.kr/frame/sysUser.do", function()
        {
            //console.log('-> capture screen step 0');
        });

        page.render("./capture/step_" + testindex + ".png");
    },
    function() {
        //Enter Credentials
        page.evaluate(function() {

            var formName = document.frmLogin;


            formName.userid.value = '2010011064';
            formName.password.value = 'rjsejrl1!';

            console.log('-> capture screen step 1');

            goLogin();

            //}
        });
    },
    function() {
        //Login
        page.evaluate(function() {
            console.log('-> capture screen step 2');

        });
    },
    function() {

        //로그인이 완료된 페이지
        var postBody = "mode=doListMst"+
            "&sch_dept_group_gb=201"+
            "&sch_est_year=2015"+
            "&sch_est_term_gb=20"+
            "&sch_student_no=2010011064";
            //"&sch_student_no=2011010904";   // 원만이

        // 수업정보 JSON 받아오는 요청
        setText = true;
        page.open('https://nis.gnu.ac.kr/susj/su/sa_su_7150q.gnu', 'POST', postBody, function() {

            var plainText = JSON.parse(page.plainText);

            plainText = removeNull(plainText);

            //alert(plainText);
            console.log(JSON.stringify(plainText));
            //console.log('Status: ' + status);
            // Do other things here...
        });

        page.render("./capture/step_" + testindex + ".png");

    },
    function () {
        // Output content of page to stdout after form has been submitted
        page.evaluate(function() {
            //로그인이 완료된 페이지
            console.log('-> capture screen step 3');
        });
    }
];


interval = setInterval(function() {
    if (!loadInProgress && typeof steps[testindex] == "function") {
        //console.log("step " + testindex);
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        phantom.exit();
    }
}, 50);