const express = require('express')
const app = express()

const Chance = require('chance')
const chance = new Chance()

app.get('/', (req, res) => res.send('Hello World!'))

require('./basicAuth')(app)
require('./oauth')(app)

app.get('/posts', (req, res) => {
    let posts = []
    for (let i=0; i<50; i++) {
        let d = {}
        d["id"] = i
        d["title"] = `${i} title`
        d["content"] = chance.paragraph({sentences: 5})
        posts.push(d)
    }
    res.json(posts)
})

let port = process.env.PORT || 3000
app.listen(port, () => console.log('Example app listening on port ' + port))