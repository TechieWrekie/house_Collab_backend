const express = require('express')
const res = require('express/lib/response')
const database = require('./server/config/db')
const cors = require('cors')
const app = express()
const PORT = 3000 || process.env
const apiRoutes = require('./server/routes/apiRoutes')

database.connectToDatabase()
app.use(cors());

app.use(express.static(__dirname + '/server/public/'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false, parameterLimit: 500000000 }));
app.get('/', (req, res) => {
    res.send('Welcome to House collab Server')
})

app.use('/api', apiRoutes)



const seed = require('./server/config/seed')
seed.AdminCreate()
.app.listen(PORT, () => {
    console.log("Server Listerning to port ", PORT)
})
 