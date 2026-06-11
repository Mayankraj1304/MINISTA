require('dotenv').config()
const app = require("./app")
const connectToDatabase = require("./config/database")


connectToDatabase()


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})