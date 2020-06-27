const express = require('express');
const uh = require('./user_helper')
const router = express.Router();


router.get('/', (req, res, next) => {
    uh.getGithub().then(result => res.json(result)).catch(err => res.send(err));
});
router.get('/otp', (req, res, next) => {
    uh.sendSmsOtp().then(result => res.json(result)).catch(err => res.send(err));
});

router.post('/phone_sign_up', (req, res, next) => {
    uh.phone_save(req.body.phone, req.body.password).then(result => {
        uh.sendSmsOtp(req.body.phone).then(result => res.json(result)).catch(err => res.json(err))
    }).catch(err => res.json(err));
});

router.post('/verify_otp', (req, res, next) => {
    uh.verifyOtp(req.body.phone, req.body.otp).then(result => {
        if (result.type === "success") {
            uh.phone_verified_db_change(req.body.phone).then(result => {
                uh.getSignedAuthKey(result).then(result => {
                    res.json(result)
                }).catch(err => res.json(err))
            }).catch(err => res.json(err))
        } else {
            res.json({"type": "failure", "error": "OTP not correct"})
        }
    }).catch(err => res.send(err));
});

router.post('/phone_signin', (req, res, next) => {
    uh.phone_signin(req.body.phone, req.body.password)
        .then(result => {
            if (result.data.auth.length > 0) {
                uh.getSignedAuthKey(result).then(result => {
                    res.json(result)
                }).catch(err => res.json(err))
            } else {
                res.json({type: "failure", error: "Phone Number or Password not found"})
            }
        })
        .catch(err => {
            console.log(err);
            res.json(err)
        })
});

router.post('/user_info', (req, res, next) => {
    uh.verifyAuthKey(req.get('auth_token')).then(result => {
        res.json(result);
    }).catch(err => res.json(err));
});

module.exports = router;
