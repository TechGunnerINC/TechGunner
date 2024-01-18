import type { PageLoad } from './$types'
import axios from 'axios'
export const load = (async ({ url }) => {
	const port = 3000 ?? 5000 ?? 6000
	const res = await axios.get(`http://localhost:${port}${url.pathname}`, {
		withCredentials: true
	})
	const user = res.data.user
	const state = res.data.state
	console.log(res.data)

	return { user, state }
}) satisfies PageLoad
