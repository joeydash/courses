const fetch = require('node-fetch');
var API_KEY = '98631eee81199733066c20f5c2a88e41-9a235412-8a0a2a2e';
var DOMAIN = 'shoptohome.co.in';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

// RANDOM 6 DIGIT OTP GENERATOR
let otp = Math.floor(100000 + Math.random() * 900000);


let app = {
    sendOTPMail: () => {
        return new Promise((resolve, reject) => {
            const data = {
                from: "OTP Service <otp@shoptohome.co.in>",
                to: 'vs201400@gmail.com',
                subject: 'No-Reply: Your OTP',
                text: 'Your OTP is ' + otp
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
    email_signup : (email, username)=>{
        return new Promise((resolve, reject) => {
            fetch('https://lmsdb.herokuapp.com/v1/graphql',{
                method: "post",
                header: {
                    'x-hasura-admin-secret': 'joeydash'
                },
                body: JSON.stringify({
                    query : `mutation MyMutation($email_otp: numeric = "", $email: String = "", $username: String = "") {
                              insert_auth(objects: {email: $email, email_otp: $email_otp, username: $username}, on_conflict: {constraint: auth_email_carrier_key, update_columns: email_otp}) {
                                affected_rows
                              }
                            }`,
                    variables: {
                        "email_otp": otp,
                        "email": email,
                        "username": username
                    }
                })
            })
            .then(res => res.json())
            .then(res => {
                if (res.data.insert_auth.affected_rows > 0) {
                    alert("SignUp Successful!");
                }
            }).catch(err => console.log(err));
        })
    },
    otp_verif : (user_otp)=>{
        return new Promise((resolve, reject) => {
            fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "POST",
                headers: {
                    "x-hasura-admin-secret": "joeydash"
                },
                body: JSON.stringify({
                    query: ``,
                    variables: {
                       
                    }
                })
            }
            ).then(res => res.json())
            .catch(err => console.log(err));
        })
    },
    getGithub: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.github.com/users/joeydash').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    }
}


module.exports = app;
