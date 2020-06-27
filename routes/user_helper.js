const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;
const jWTKey = "joeydash";

let app = {
    getGithub: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.github.com/users/joeydash').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    },
    sendSmsOtp: (phone) => {
        return new Promise((resolve, reject) => {
            fetch('https://api.msg91.com/api/v5/otp?authkey=332926ASt3V8aIVwSx5eeb95d4P1&template_id=5eec94dfd6fc05559d21b91a&mobile=' + phone + '&invisible=1&otp_length=6').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    },
    verifyOtp: (phone, otp) => {
        return new Promise((resolve, reject) => {
            fetch('https://api.msg91.com/api/v5/otp/verify?mobile=' + phone + '&otp=' + otp + '&authkey=332926ASt3V8aIVwSx5eeb95d4P1').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    },
    phone_save: (phone, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                        method: "post",
                        headers: {
                            'x-hasura-access-key': "joeydash"
                        },
                        body: JSON.stringify({
                            query: `mutation MyMutation($phone: String = "", $password: String = "",  $salt: String = "") {
                                insert_auth(objects: {phone: $phone, password: $password,  salt: $salt, carrier: "phone"}, on_conflict: {update_columns: phone, constraint: auth_phone_carrier_key}) {
                                affected_rows
                              }
                            }`,
                            variables: {
                                "salt": salt,
                                "phone": phone,
                                "password": hash
                            }
                        })
                    }).then(res => res.json())
                        .then(res => resolve(res)).catch(err => reject(err))
                });
            });
        })
    },
    phone_verified_db_change: (phone) => {
        return new Promise((resolve, reject) => {
            fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "post",
                headers: {
                    'x-hasura-access-key': "joeydash"
                },
                body: JSON.stringify({
                    query: `mutation MyMutation($phone: String = "") {
                      update_auth(where: {phone: {_eq: $phone}}, _set: {phone_verified: true}) {
                        affected_rows
                      }
                    }`,
                    variables: {
                        "phone": phone,
                    }
                })
            }).then(res => res.json())
                .then(res => resolve(res)).catch(err => reject(err))
        })
    },

    phone_signin: (phone, password) => {
        return new Promise((resolve, reject) => {
            fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "post",
                headers: {
                    'x-hasura-admin-secret': 'joeydash'
                },
                body: JSON.stringify({
                    query: `query MyQuery($phone: String = "") {
                              auth(where: {phone: {_eq: $phone}, carrier: {_eq: "phone"}}) {
                                salt
                              }
                            }`,
                    variables: {
                        "phone": phone,
                    }
                })
            }).then(res => res.json()).then(res => {
                if (res.data.auth.length > 0) {
                    bcrypt.hash(password, res.data.auth[0].salt, function (err, hash) {
                        fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                            method: "post",
                            headers: {
                                'x-hasura-admin-secret': 'joeydash'
                            },
                            body: JSON.stringify({
                                query: `query MyQuery($phone: String = "", $password: String = "") {
                                          auth(where: {phone: {_eq: $phone}, carrier: {_eq: "phone"}, password: {_eq: $password}}) {
                                            username
                                            phone_verified
                                            phone
                                            id
                                            fullname
                                            email_verified
                                            email
                                            dp
                                            carrier
                                            career_user_id
                                          }
                                        }`,
                                variables: {
                                    "phone": phone,
                                    "password": hash
                                }
                            })
                        }).then(res => res.json()).then(res => resolve(res)).catch(err => reject(err));
                    });
                } else {
                    reject({type: "failure", error: "Phone Number or Password not found"});
                }
            }).catch(err => reject(err));
        });
    },
    getSignedAuthKey: (data) => {
        return new Promise((resolve, reject) => {
            jwt.sign(data, jWTKey, function (err, token) {
                if (err) reject({type: "failure", error: err});
                resolve({type: "success", auth_token: token})
            });
        });
    },
    verifyAuthKey: (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, jWTKey, function (err, payload) {
                // if token alg != RS256,  err == invalid signature
                if (err) reject({type: "failure", error: err});
                resolve(payload);
            });
        });
    }
}


module.exports = app;
