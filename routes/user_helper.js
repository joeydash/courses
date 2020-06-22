const fetch = require('node-fetch');

let app = {
    getGithub: () => {
      return new Promise((resolve, reject) => {
        fetch('https://api.github.com/users/joeydash').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
      })
    },
    sendSmsOtp: () => {
      return new Promise((resolve, reject) => {
        fetch('https://api.msg91.com/api/v5/otp?authkey=332926ASt3V8aIVwSx5eeb95d4P1&template_id=5eec94dfd6fc05559d21b91a&mobile=919695553773&invisible=1&otp=1234').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
      })
    },
  new_user: (phone, username) => {
    return new Promise((resolve, reject) => {
          fetch('https://lmsdb.herokuapp.com/v1/graphql', {
                method: "post",
                header: {
                  'x-hasura-admin-secret': 'joeydash'
                },
                body: JSON.stringify({
                    query :  `mutation MyMutation($phone: String = "", $username: String = "") {
                        insert_auth(objects: {
                          phone: $phone,
                          username: $username
                        }, on_conflict: {
                          constraint: auth_email_carrier_key,
                          update_columns: career_user_id
                        }) {
                          affected_rows
                        }
                      }`,
                      variables: {
                        "phone": phone,
                        "username": usernaem
                      }

                 })
     })
     .then(res => res.json())
     .then(res=> {
       if(res.data.insert_auth.affected_rows > 0){
         alert("Signup Successfull!");
       }
     }).catch(err => console.log(err))
       })
   }
 }




module.exports = app;
