import type { PageLoad } from './$types'
import axios from '../../../axios.config'
export const load = (async ({ url }) => {
	
	const res = await axios.get(`${url.pathname}`)
	
	const user = res.data.user
	const state = res.data.state
	console.log(res.data)

	return { user, state }
}) satisfies PageLoad
