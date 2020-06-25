const express = require('express');
const uh = require('./user_helper')
const router = express.Router();


router.get('/', (req, res, next) => {
    uh.sendOTPMail().then(result => res.json(result)).catch(err => res.send(err));
});

router.post('/email_signup', (req, res, next) => {
    uh.email_signup(req.body.username, req.body.email, req.body.password)
        .then(result => {
            uh.sendOTPMail(result.data.insert_auth.returning[0].email,
                result.data.insert_auth.returning[0].otp)
                .then(result => res.json(result))
                .catch(err => res.send(err));
        })
        .catch(err => {
            console.log(err);
            res.json(err)
        })
});

router.post('/email_signin', (req, res, next) => {
    uh.email_signin(req.body.email, req.body.password)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err)
        })
});

router.post('/verify_email_signup', (req, res, next) => {
    uh.mailVerify(req.body.email, req.body.otp)
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

module.exports = router;
