const express = require('express');
const uh = require('./user_helper')
const router = express.Router();




router.get('/', (req, res, next) => {
    uh.sendOTPMail().then(result=>res.json(result)).catch(err=>res.send(err));
});

router.get('/email_signup', (req, res, next) => {
    uh.sendOTPMail().then(result=>res.json(result)).catch(err=>res.send(err));
});

module.exports = router;
