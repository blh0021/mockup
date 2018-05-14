const bodyParser = require('body-parser')
const helpers = require('./helpers')
const Chance = require('chance')
const chance = new Chance()

const urlencodedParser = bodyParser.urlencoded({ extended: false })

var grantTypeCheck = (body, header) => {
    const types = ['client_credentials', 'authorization_code', 'implicit', 'password_credentials']
    if (types.includes(body.grant_type) || types.includes(header.grant_type)) {
        return null
    } else {
        return "missing or invalid grant_type"
    }
}

var basicAuth = (authHeader) => {
    if (authHeader == undefined) {
        return "Missing Basic Authorization Header"
    }
    const auth = { login: 'test', password: 'pass' }
    const b64auth = (authHeader || '').split(' ')[1] || ''
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')
    console.log("Login : " + login)
    if (!login || !password || login !== auth.login || password !== auth.password) {
        return "invalid username or password"
    }

    return null
}

module.exports = (app) => {
    app.all('/oauth2/token', urlencodedParser, (req, res) => {
        console.log(req.body)
        console.log(req.headers.authorization)
        let authError = null
        authError = grantTypeCheck(req.body, req.headers)
        authError = helpers.basicAuth(req.headers.authorization)
        if (authError != null) {
            console.log("ERROR: " + authError)
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).json({
                "error": authError
            })
            return
        }

        let token = (new Date().getTime()).toString()
        res.json({
            "token_type": "bearer",
            "access_token": Buffer.from(token).toString('base64')
        })
    })

    let tokenExtractor = (b64auth) => {
        let token = Buffer.from(b64auth, 'base64').toString('ascii')
        return Number(token)
    }

    app.get('/oauth2/*', (req, res, next) => {
        console.log(req.headers.authorization)
        const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
        let token = tokenExtractor(b64auth)
        let timeLimit = 10*60*1000
        let current = new Date().getTime()

        if(token < current-timeLimit || token > current+timeLimit || !req.headers.authorization.includes("Bearer")) {
            console.log("Failed to authenticate : " + req.headers["x-forwarded-for"])
            res.set('WWW-Authenticate', 'Bearer realm="401"')
            res.status(401).send('Invalid Token')
            return
        }
        next()
    })

    app.get('/oauth2/posts', (req, res) => {
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