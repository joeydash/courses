var express = require('express');
var router = express.Router();
var fs = require('fs');
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

router.get('/vasu', function(req, res, next) {
	res.render('vasu');
});
router.get('/vaibhav', function(req, res, next) {
  	res.render('vaibhav');
});

router.get('/joey', function(req, res, next) {
    res.render('joey');
});

router.get('/', function(req, res, next) {
    res.render('home/index');
});
router.get('/course', function(req, res, next) {
    res.render('course/index');
});

router.get('/add_course', function(req, res, next) {
    res.render('add_course/index');
});

router.get('/edit_course', function(req, res, next) {
    res.render('edit_course/index');
});

router.get('/signin', function(req, res, next) {
    res.render('new_user/index');
});

router.get('/sms_otp', function(req, res, next) {
    res.render('user_verify/index');
});
router.get('/forum', function(req, res, next) {
    res.render('forum/index');
})

router.get('/test',(req, res, next)=>{
    res.render('home/index')
});
module.exports = router;
