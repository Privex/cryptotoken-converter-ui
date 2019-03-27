// var api_node = 'https://converter-api.steem-engine.com';
// var api_node = 'http://127.0.0.1:8000';

var coin_api = {
    api_node: 'https://converter-api.steem-engine.com',
    load_pairs: async function() {
        return new Promise(resolve => {
            return fetch(coin_api.api_node + '/api/pairs/')
            .then((response) => { 
                if (response.status !== 200) {
                    return console.error('non-200 response');
                }
                return response.json().then((data) => {
                    return resolve(data);
                })
            })
        });
    },
    
    load_coins: async function() {
        /**
         * Resolves a list of coins
         */
        return new Promise(resolve => {
            return fetch(coin_api.api_node + '/api/coins/')
            .then((response) => { 
                if (response.status !== 200) {
                    return console.error('non-200 response');
                }
                return response.json().then((data) => {
                    return resolve(data);
                })
            })
        });
    },
    load_deposits: async function(limit = 100, offset = 0, query = {}) {
        /**
         * Resolves an object containing {count, next, previous, results}
         * query options: 'address', 'from_account', 'to_account', 'txid', 'memo'
         */
        return new Promise(resolve => {
            var url = `/api/deposits/?limit=${limit}&offset=${offset}`
            for (var q in query) {
                url += `&${q}=${query[q]}`;
            }
            return fetch(coin_api.api_node + url)
            .then((response) => { 
                if (response.status !== 200) {
                    return console.error('non-200 response');
                }
                return response.json().then((data) => {
                    return resolve(data);
                })
            })
        });
    },
    load_conversions: async function(limit = 100, offset = 0, query = {}) {
        /**
         * Resolves an object containing {count, next, previous, results}
         * query options: 'from_coin', 'to_coin'
         */
        return new Promise(resolve => {
            var url = `/api/conversions/?limit=${limit}&offset=${offset}`
            for (var q in query) {
                url += `&${q}=${query[q]}`;
            }
            return fetch(coin_api.api_node + url)
            .then((response) => { 
                if (response.status !== 200) {
                    return console.error('non-200 response');
                }
                return response.json().then((data) => {
                    return resolve(data);
                })
            })
        });
    },
    convert: async function(from_coin, to_coin, destination) {
        return new Promise((resolve, reject) => {
            return fetch(coin_api.api_node + '/api/convert/', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({from_coin, to_coin, destination})
            })
            .then((response) => { 
                if (response.status !== 200) {
                    console.error('non-200 response');
                    return response.json().then((data) => {
                        return reject(data.message)
                    })
                }
                return response.json().then((data) => {
                    return resolve(data);
                })
            })
        });
    }
}

export default coin_api