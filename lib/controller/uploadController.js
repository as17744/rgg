const uploadController = (req, res) => {
    console.log(req.method);
    if (req.method === 'POST') {
        req.on('data', (chunk) => {
            console.log(chunk.toString());
        });
        req.on('end', () => {
            const m = {
                a: 1,
                b: 2,
            }
            res.writeHead(
                200,
                {'Content-Type': 'application/json; charset="utf-8"'}
            );
            res.end(JSON.stringify(m));
        });
    } else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('Wrong query method');
        res.end();
    }
}
module.exports = uploadController;