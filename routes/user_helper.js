const fetch = require('node-fetch');

let app = {
    name: "joeaydh",
    getName: () => {
        return app.name;
    },
    getGithub: () => {
        return new Promise((resolve, reject) => {
            fetch('https://api.github.com/users/joeydash')
                .then(res => res.text())
                .then(res => {
                    resolve(res);
                })
                .catch(onError => reject(onError));
        })
    }
}

module.exports = app;
