const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/posts', (req, res) => {
    let posts = []
    for (let i=0; i<50; i++) {
        let d = {}
        d["title"] = `#{i} title`
        posts.push(d)
    }
    res.json(posts)
})

let port = process.env.PORT || 3000
app.listen(port, () => console.log('Example app listening on port ' + port))