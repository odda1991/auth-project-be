const jwt = require("jsonwebtoken")

function auth(req, res, next) {
    const bearerToken = req.header("authorization")
    // if there is no authorization header we should really send an error...
    const token = bearerToken.split(" ")[1];
    
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verify.user
    
        next()
    } catch {
        res.status(403).send("Invalid token")
    }
}

module.exports = auth