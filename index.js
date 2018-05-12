const express = require('express')
const app = express()
const Chance = require('chance')
const chance = new Chance()

app.get('/', (req, res) => res.send('Hello World!'))

require('./simple')(app)
require('./basicAuth')(app)
require('./oauth')(app)

let port = process.env.PORT || 3000
app.listen(port, () => console.log('Example app listening on port ' + port))