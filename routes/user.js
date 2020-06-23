const express = require('express');
const uh = require('./user_helper')
const router = express.Router();




router.get('/', (req, res, next) => {
    uh.sendOTPMail().then(result=>res.json(result)).catch(err=>res.send(err));
});

router.post('/email_signup', (req, res, next) => {
    uh.email_signup(req.body.email)
    .then(result => {
        uh.sendOTPMail(result.data.insert_auth.returning[0].email, 
                        result.data.insert_auth.returning[0].email_otp)
        .then(result => res.json(result))
        .catch(err => res.send(err));
    })
    .then(result => {
        uh.mailVerify(result.data.insert_auth.returning[0].email,
                        result.data.insert_auth.returning[0].email_otp)
        .then(result => res.json(result))
        .catch(err => res.send(err));
    })
    .catch(err => {
        console.log(err);
        res.json(err)})
});


module.exports = router;
