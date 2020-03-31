const Vue = require('vue');
const hello = require('../vue/hello');

const renderer = require('vue-server-renderer').createRenderer();

const vueProcess = (req, res) => {
    renderer.renderToString(hello).then(html => {
        res.writeHead(
            200,
            {
                'Content-Type': 'text/html; charset="utf-8"',
            }
        );
        res.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head><title>Hello</title></head>
            <body>${html}</body>
            </html>
        `);
    }).catch(err => {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500');
        res.end();
    });
}

module.exports = vueProcess;
