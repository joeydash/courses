const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
            bcrypt.hash(password, saltRounds, function (err, hash) {
            fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "post",
                headers: {
                    'x-hasura-access-key': "joeydash"
                },
                body: JSON.stringify({
                    query: `mutation MyMutation($phone: String = "",, $password: String = "") {
                              insert_auth(objects: {phone: $phone, password: $password}, on_conflict: {update_columns: phone, constraint: auth_phone_carrier_key}) {
                                affected_rows
                              }
                            }`,
                    variables: {
                        "phone": phone,
                        "password": hash
                    }
                })
            }).then(res => res.json())
                .then(res => resolve(res)).catch(err => reject(err))
        })
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
    }
}


module.exports = app;
