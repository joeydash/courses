const express = require('express');
const uh = require('./user_helper')
const router = express.Router();


router.get('/', (req, res, next) => {
    uh.getGithub().then(result=>res.json(result)).catch(err=>res.send(err));
});
router.get('/otp', (req, res, next) => {
    uh.sendSmsOtp().then(result=>res.json(result)).catch(err=>res.send(err));
});

module.exports = router;
