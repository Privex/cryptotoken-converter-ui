var api_node = 'https://converter-api.steem-engine.com'
// var api_node = 'http://127.0.0.1:8000';

var coin_api = {
    load_pairs: async function() {
        return new Promise(resolve => {
            fetch(api_node + '/api/pairs/')
            .then((response) => { 
                console.log('fetched pairs');
                if (response.status !== 200) {
                    return console.error('non-200 response');
                }
                response.json().then((data) => {
                    console.log('decoded json and returned', data);
                    resolve(data);
                })
            })
        });
    },
    
    load_coins: async function() {
        return new Promise(resolve => {
            fetch(api_node + '/api/coins/')
            .then((response) => { 
                console.log('fetched coins');
                if (response.status !== 200) {
                    return console.error('non-200 response');
                }
                response.json().then((data) => {
                    console.log('decoded json and returned', data);
                    resolve(data);
                })
            })
        });
    },
    convert: async function(from_coin, to_coin, destination) {
        return new Promise((resolve, reject) => {
            return fetch(api_node + '/api/convert/', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({from_coin, to_coin, destination})
            })
            .then((response) => { 
                console.log('fetched coins');
                if (response.status !== 200) {
                    console.error('non-200 response');
                    return response.json().then((data) => {
                        return reject(data.message)
                    })
                }
                return response.json().then((data) => {
                    console.log('decoded json and returned', data);
                    return resolve(data);
                })
            })
        });
    }
}