require('dotenv').config()
const sequelize = require('./src/config/db')
const express = require('express')
const cors = require('cors')
const userRoutes = require('./src/routes/userRoutes')
const postsRoutes = require('./src/routes/postsRoutes')
const commentsRoutes = require('./src/routes/commentsRoutes')

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/userRoutes', userRoutes)
app.use('/api/postsRoutes', postsRoutes)
app.use('/api/commentsRoutes', commentsRoutes)

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await sequelize.authenticate()
        console.log('База данных подключена')

        await sequelize.sync({ alter: true })
        console.log('Базы синхронизировались')

        app.listen(PORT, () => { console.log(`Server starten on port http://localhost:${PORT}`); })

    } catch (error) {
        console.log("Ошибка: " + error.message);

    }
}
start()



