const fetch = require('node-fetch');
var API_KEY = '98631eee81199733066c20f5c2a88e41-9a235412-8a0a2a2e';
var DOMAIN = 'shoptohome.co.in';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});
let otp = Math.floor(100000 + Math.random() * 900000);


let app = {
    sendOTPMail: () => {
        return new Promise((resolve, reject) => {
            const data = {
                from: "OTP Service <otp@shoptohome.co.in>",
                to: 'vs201400@gmail.com',
                subject: 'No-Reply: Your OTP',
                text: 'You OTP is ' + otp
            };

            mailgun.messages().send(data, (error, body) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    // console.log(body);
                    resolve(body);
                }
            });
        })
    },
    getGithub: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.github.com/users/joeydash').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    }
}


module.exports = app;
