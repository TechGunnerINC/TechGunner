import { Router } from 'express'
import {
	get,
	edit,
	remove,
	blogs,
	videos,
	posts,
	services,
	collections
} from '../Controllers/user.js'
import { token } from '../Middlewares/auth.js'
import { va } from '../Middlewares/valid.js'
const router = Router()
router.route('/:username').get(get).put(edit, token, va).delete(remove, token)
router.route('/:username/blogs').get(blogs)
router.route('/:username/videos').get(videos)
router.route('/:username/posts').get(posts)
router.route('/:username/services').get(services)
router.route('/:username/collections').get(collections)
export default router
