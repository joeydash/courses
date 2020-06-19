const express = require('express');
const uh = require('./user_helper')
const router = express.Router();

var API_KEY = 'YOUR_API_KEY';
var DOMAIN = 'YOUR_DOMAIN_NAME';
var mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

const data = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'foo@example.com, bar@example.com',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomeness!'
};

mailgun.messages().send(data, (error, body) => {
    if (error) {
        console.log(error);
    }
    console.log(body);
});


router.get('/', (req, res, next) => {
    uh.getGithub().then(result=>res.json(result)).catch(err=>res.send(err));
});

module.exports = router;
