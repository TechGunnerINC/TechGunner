import { Elysia } from 'elysia'
import { helmet } from 'elysia-helmet'
import { rateLimit } from 'elysia-rate-limit'
import swagger from '@elysiajs/swagger'
import cors from '@elysiajs/cors'
import user from './Controllers/user'
import blog from './Controllers/blog'

const app = new Elysia()

app
	.onError(({ code, error, path }) => {
		if (code === 'NOT_FOUND') {
			return { err: `Couldn't find what you was looking for` }
		}
		if (code === 'INTERNAL_SERVER_ERROR') {
			return { err: `Something went wrong on our server, We'll try to fix it ASAP!` }
		}
		console.error(`Error occurred on path ${path} Error: ${error}, ${code}`)
	})
	.use(helmet())
	.use(swagger())
	.use(cors({ origin: process.env.DOMAIN, credentials: true }))
	.use(
		rateLimit({
			duration: 300000,
			max: 5200,
			responseCode: 420,
			responseMessage: 'Our server needs a 5 min coffee break'
		})
	)
	.use(user)
	.use(blog)
	.onAfterHandle(({ request }) => {
		const startTime = process.hrtime()
		const endTime = process.hrtime(startTime)
		const startupTimeInMs = endTime[0] * 1e3 + endTime[1] / 1e6
		console.log(`Startup time: ${startupTimeInMs.toFixed(2)} ms`)
	})
	.listen(process.env.PORT || 5000, () => {
		console.log(`Server running on ${app.server?.url}`)
	})
