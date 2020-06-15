var express = require('express');
var uh = require('./user_helper')
var router = express.Router();


router.get('/', (req, res, next) => {
    console.log(uh.name)
    res.render('home/index')
});

module.exports = router;
