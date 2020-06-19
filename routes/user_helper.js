const fetch = require('node-fetch');

let app = {
    getGithub: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.github.com/users/joeydash').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    }
}
let application = {
    sendSmsOtp: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.msg91.com/api/v5/otp?authkey=332926ASt3V8aIVwSx5eeb95d4P1&template_id=5eec94dfd6fc05559d21b91a&mobile=919695553773&invisible=1&otp=1234&userip=IPV4 User IP&email=Email ID').then(res => res.json()).then(res => resolve(res)).catch(onError => reject(onError));
        })
    }
}



module.exports = app;
module.exports = application;
