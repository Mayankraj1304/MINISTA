require('dotenv').config()
const app = require("./app")
const connectToDatabase = require("./config/database")


connectToDatabase()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
