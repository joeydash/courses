const fetch = require('node-fetch');

let app = {
    getGithub: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.github.com/users/joeydash').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    },
    sendSmsOtp: (phone) => {
        return new Promise((resolve, reject) => {
            fetch('https://api.msg91.com/api/v5/otp?authkey=332926ASt3V8aIVwSx5eeb95d4P1&template_id=5eec94dfd6fc05559d21b91a&mobile=' + phone + '&invisible=1').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    },
    phone_fullname_save: (phone, fullname) => {
        return new Promise((resolve, reject) => {
            fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "post",
                header: {
                    'x-hasura-admin-secret': 'joeydash'
                },
                body: JSON.stringify({
                    query: `mutation MyMutation($phone: String = "", $fullname: String = "") {
                              insert_auth(objects: {phone: $phone, fullname: $fullname}, on_conflict: {constraint: auth_email_carrier_key, update_columns: career_user_id}) {
                                affected_rows
                              }
                            }`,
                    variables: {
                        "phone": phone,
                        "fullname": fullname
                    }
                })
            }).then(res => res.json())
                .then(res => {
                    console.log(JSON.stringify(res))
                    if (res.data.insert_auth.affected_rows > 0) {
                        resolve(res)
                    }
                }).catch(err => {
                console.log(err);
                reject(err);
            })
        })
    }
}


module.exports = app;
