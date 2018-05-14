const helpers = require('./helpers')
const Chance = require('chance')
const chance = new Chance()

module.exports = (app) => {

    app.get('/basicAuth/*', (req, res, next) => {
        let authError = helpers.basicAuth(req.headers.authorization)

        if (authError != null) {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send(authError)
            return
        }
        next();
    })

    app.get('/basicAuth/posts', (req, res) => {
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
}