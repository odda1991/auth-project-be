const express = require("express")
require('dotenv').config()

const app = express()

app.get("/", (req, res) => {
    console.log(process.env)
    res.send("Hello migracode!")
})

const port = process.env.PORT || 4000

app.listen(port, function () {
    console.log(`Server is running at port ${port}`)
})