module.exports = {

    basicAuth: (authHeader) => {
        if (authHeader == undefined) {
            return "Missing basic authorization header"
        }
        const auth = { login: 'test', password: 'pass' }
        const b64auth = (authHeader || '').split(' ')[1] || ''
        const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')
        console.log("Login : " + login)
        if (!login || !password || login !== auth.login || password !== auth.password) {
            return "Missing or invalid username or password"
        }
    
        return null
    }

}