const express = require('express');
const uh = require('./user_helper')
const router = express.Router();




router.get('/', (req, res, next) => {
    uh.sendOTPMail().then(result=>res.json(result)).catch(err=>res.send(err));
});

router.post('/email_signup', (req, res, next) => {
    uh.email_signup(req.body.email, req.body.username)
    .then(result => {
        uh.sendOTPMail(req.body.email).then(result => res.json(result)).catch(err => res.send(err));
    })
    .catch(err => res.json(err))
});

module.exports = router;
