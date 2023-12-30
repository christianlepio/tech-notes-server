// to request data from other domain (ie: google.com)
// create a list that is allowed to access the backend (REST API)
const allowedOrigins = [
    'https://www.yoursite.com',
    'https://127.0.0.1:5500', 
    'http://localhost:3500',
    'http://localhost:5173' //React JS url
]

module.exports = allowedOrigins