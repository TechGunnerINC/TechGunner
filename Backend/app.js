import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import dotenv from 'dotenv'
import blog from './Routes/blogs.js'
import user from './Routes/user.js'
import auth from './Routes/auth.js'
import helmet from 'helmet'
import compression from 'compression'
dotenv.config()

const app = express()
const server = http.createServer(app)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true
	})
)
app.use(helmet())
app.use(compression())

app.use('/blog', blog)
app.use('/profile', user)
app.use('/auth', auth)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
