const express = require("express")
require('dotenv').config()
const bcrypt = require("bcrypt")

const generateJwt = require("./utils/jwt.js")
const authorize = require("./middleware/authorize.js")
const cors = require('cors')

const quotes = require("./quotes.json");

const app = express()

const users = []

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello migracode!")
})

app.post("/users/sign-up", async function (request, response) {
    const { email, name, password } = request.body
    
    try {
        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)
        const userId = users.length
        const newUser = {
            id: userId,
            email: email,
            password: encryptedPassword,
            name: name
        }
        users.push(newUser)
    
        response.send({jwtToken: generateJwt(userId), isAuthenticated: true})
    } catch (error) {
        console.error(error.message);
        response.status(500).send({error: error.message});
    }
})

app.post("/users/sign-in", async function (request, response) {
    const { email, password } = request.body

    try {
        const foundUser = users.find(function (user) {
            return user.email == email
        })
        if (foundUser == undefined) {
            return response.status(401).json({error: "Invalid Credential", isAuthenticated: false});
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password)
        if (isPasswordValid == false) {
            return response.status(401).json({error: "Invalid Credential", isAuthenticated: false});
        }

        response.send({jwtToken: generateJwt(foundUser.id), isAuthenticated: true})

    } catch (error) {
        console.error(error.message);
        response.status(500).send({error: error.message});
    }
})

app.get("/quotes", authorize, function (request, response) {
    response.json(quotes)
})

const port = process.env.PORT
app.listen(port, function () {
    console.log(`Server is running at port ${port}`)
})