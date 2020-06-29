var express = require('express');
var router = express.Router();
var fs = require('fs');

const uh = require('./user_helper')


/* GET home page. */
// router.get('/', function(req, res, next) {
//   fs.readFile('./public/docs/docs_list.json',"utf8", function(err, data) {
//     var text  = data;
//   	res.render('index',{docs_list : JSON.parse(text)});
//   });
// });
// router.get('/docs_view/:docs', function(req, res, next) {
//   res.render('docs_view', { course: req.params.docs });
// });

router.get('/vasu', function (req, res, next) {
    res.render('vasu');
});
router.get('/vaibhav', function (req, res, next) {
    res.render('vaibhav');
});

router.get('/joey', function (req, res, next) {
    res.render('joey');
});

router.get('/', function (req, res, next) {
    res.render('home/index');
});
router.get('/course', function (req, res, next) {
    res.render('course/index');
});

router.get('/add_course', function (req, res, next) {
    res.render('add_course/index');
});

router.get('/edit_course', function (req, res, next) {
    res.render('edit_course/index');
});

router.get('/email_signup', function (req, res, next) {
    res.render('email_signup/index');
});
router.get('/email_signin', function (req, res, next) {
    res.render('email_signin/index');
});

router.get('/phone_signup', function (req, res, next) {
    res.render('new_user/index');
});

router.get('/phone_signin', function (req, res, next) {
    res.render('signin_user/index');
});


router.get('/forum', function (req, res, next) {
    res.render('forum/index');
})

router.get('/test', (req, res, next) => {
    res.render('home/index')
});

router.get('/webhook', (req, res, next) => {
    uh.verifyAuthKey(req.get('Authorisation').split(' ')[1]).then(result => {
        if (result.data.auth.length > 0) {
            res.json({
                "sub": "1234567890",
                "name": "John Doe",
                "admin": true,
                "iat": 1516239022,
                "https://hasura.io/jwt/claims": {
                    "x-hasura-allowed-roles": ["editor","user", "mod"],
                    "x-hasura-default-role": "user",
                    "x-hasura-user-id": result.data.auth[0].id,
                    "x-hasura-org-id": "123",
                    "x-hasura-custom": "custom-value"
                }
            });
        }else{
            res.json({});
        }
    }).catch(err => res.json(err));
});


module.exports = router;
