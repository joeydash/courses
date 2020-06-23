const fetch = require('node-fetch');
const API_KEY = '98631eee81199733066c20f5c2a88e41-9a235412-8a0a2a2e';
const DOMAIN = 'shoptohome.co.in';
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});


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
    email_signup: (email) => {
        return new Promise((resolve, reject) => {
            fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "post",
                headers: {
                    'x-hasura-admin-secret': 'joeydash'
                },
                body: JSON.stringify({
                    query: `mutation MyMutation($email_otp: numeric = "", $email: String = "") {
                              insert_auth(objects: {email: $email, email_otp: $email_otp}, on_conflict: {constraint: auth_email_carrier_key, update_columns: email_otp}) {
                                affected_rows
                                returning {
                                  email_otp
                                  email
                                }
                              }
                            }`,
                    variables: {
                        "email_otp": Math.floor(100000 + Math.random() * 900000),
                        "email": email
                    }
                })
            })
                .then(res => res.json())
                .then(res => resolve(res))
                .catch(err => reject(err));
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
                    query: `mutation MyMutation($email: String = "", $email_otp: numeric = "") {
                            update_auth(where: {email_otp: {_eq: $email_otp}, email: {_eq: $email}}, _set: {email_verified: true}) {
                                affected_rows}
                            }`,
                    variables: {
                        "email_otp": otp,
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
