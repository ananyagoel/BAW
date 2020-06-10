'use strict';

const axios = require('axios');

async function post(url, body, header = {}) {
    try {
        return await axios.post(url, body, header);
    } catch (e) {
        console.error(e)
        throw new Error(e.message)
    }
}

async function get(url, header = {}) {
    try {
        return await axios.get(url, header);
    } catch (e) {
        console.error(e.message)
        throw new Error(e.message)
    }
}

module.exports = {
    post,
    get
}
