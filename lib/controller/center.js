const parse = require('url').parse;
const qs = require('querystring');
const routes = require('./route');
const dataResponse = (req, res) => {
    const query = parse(req.url).query;
    const queryData = qs.parse(query);
    routes[queryData.method](req, res);
};
module.exports = dataResponse;