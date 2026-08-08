require('dotenv').config()
const app = require("./app")
const connectToDatabase = require("./config/database")
const { env } = require("./config/env")

connectToDatabase()

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`)
})
