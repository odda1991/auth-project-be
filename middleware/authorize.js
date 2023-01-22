const jwt = require("jsonwebtoken")

function auth(req, res, next) {
    const bearerToken = req.header("authorization")

    if (bearerToken == undefined) {
        res.status(401).send({ message: "Token is not valid", isAuthenticated: false });
    }
    
    const token = bearerToken.split(" ")[1];
    
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verify.user
    
        next()
    } catch {
        res.status(401).send({ message: "Token is not valid", isAuthenticated: false });
    }
}

module.exports = auth