const fetch = require('node-fetch');
const API_KEY = '98631eee81199733066c20f5c2a88e41-9a235412-8a0a2a2e';
const DOMAIN = 'shoptohome.co.in';
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const bcrypt = require('bcrypt');
const saltRounds = 10;


let app = {
    sendOTPMail: (email, otp) => {
        return new Promise((resolve, reject) => {
            const data = {
                from: "OTP Service <otp@shoptohome.co.in>",
                to: email,
                subject: 'No-Reply: Your OTP',
                text: 'Your OTP is ' + otp
            };

            mailgun.messages().send(data, (error, body) => {
                if (error) reject(error); else resolve(body);
            });
        })
    },
    email_signup: (email, oldPass) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(oldPass, saltRounds, function (err, hash) {
                fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                    method: "post",
                    headers: {
                        'x-hasura-admin-secret': 'joeydash'
                    },
                    body: JSON.stringify({
                        query: `mutation MyMutation($email: String = "", $password: String = "", $otp: numeric = "") {
                            insert_auth(objects: { email: $email, password: $password, otp: $otp }, on_conflict: { constraint: auth_email_carrier_key, update_columns: otp }) {
                                affected_rows
                                returning {
                                    email
                                    otp
                                }
                            }
                        }`,
                        variables: {
                            "email": email,
                            "password": hash,
                            "otp": Math.floor(100000 + Math.random() * 900000)
                        }
                    })
                })
                    .then(res => res.json())
                    .then(res => resolve(res))
                    .catch(err => reject(err));
            });
        })
    },
    mailVerify: (email, otp) => {
        return new Promise((resolve, reject) => {
            fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "post",
                headers: {
                    'x-hasura-admin-secret': 'joeydash'
                },
                body: JSON.stringify({
                    query: `mutation MyMutation($email: String = "", $otp: numeric = "") {
                            update_auth(where: {otp: {_eq: $otp}, email: {_eq: $email}}, _set: {email_verified: true}) {
                                affected_rows}
                            }`,
                    variables: {
                        "otp": otp,
                        "email": email
                    }
                })
            })
                .then(res => res.json())
                .then(res => resolve(res))
                .catch(err => reject(err));
        })
    },
    getGithub: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.github.com/users/joeydash').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    }
}


module.exports = app;
