const express = require('express');
const uh = require('./user_helper')
const router = express.Router();


router.get('/', (req, res, next) => {
    uh.getGithub().then(result=>res.json(result)).catch(err=>res.send(err));
});
router.get('/otp', (req, res, next) => {
    uh.sendSmsOtp().then(result=>res.json(result)).catch(err=>res.send(err));
});
router.post('/phone_sign_up', (req, res, next) => {
    uh.phone_fullname_save(req.body.phone,req.body.name).then(result=>{
        uh.sendSmsOtp(req.body.phone).then(result=>res.json(result)).catch(err=>res.json(err))
    }).catch(err=>res.json(err));
});
module.exports = router;
