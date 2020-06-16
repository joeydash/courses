var express = require('express');
var uh = require('./user_helper')
var router = express.Router();


router.get('/', (req, res, next) => {
    uh.getGithub()
        .then(res => {
            console.log(res);
            res.json(res);
        })
        .catch(onError => {
            res.error(onError);
        })
});

module.exports = router;
