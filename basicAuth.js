const Chance = require('chance')
const chance = new Chance()

module.exports = (app) => {

    app.get('/basicAuth/*', (req, res, next) => {
        const auth = { login: 'test', password: 'pass' }
        const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
        const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

        if (!login || !password || login !== auth.login || password !== auth.password) {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send('Authentication required.')
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