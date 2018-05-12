const Chance = require('chance')
const chance = new Chance()

const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = (app) => {

    app.get('/posts', (req, res) => {
        let posts = []
        for (let i = 0; i < 50; i++) {
            let d = {}
            d["id"] = i
            d["title"] = `${i} title`
            d["content"] = chance.paragraph({ sentences: 5 })
            posts.push(d)
        }
        res.json(posts)
    })

    app.post('/post', (req, res) => {
        res.json({
            "success":  true
        })
    })

    app.post('/postEncoded', urlencodedParser, (req, res) => {
        res.json(req.body)
    })
}