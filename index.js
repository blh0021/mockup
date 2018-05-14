const express = require('express')
const app = express()
const Chance = require('chance')
const chance = new Chance()

app.get('/', (req, res) => res.send('Hello World!'))

app.all('/*', function(req, res, next) {
    console.log('DEBUG: ' + req.method + ' ' + req.originalUrl);
    console.log(req.headers);
    next();
});

require('./simple')(app)
require('./basicAuth')(app)
require('./oauth')(app)

let port = process.env.PORT || 3000
app.listen(port, () => console.log('Example app listening on port ' + port))