import type { PageServerLoad } from './$types'
import axios from '$lib/axios.config'

export const load = (async () => {
	const res = await axios.get('/blog')
	const blogs = res.data

	return { blogs }
}) satisfies PageServerLoad
