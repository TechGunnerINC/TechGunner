import { Router } from 'express'
import { login, newUser, logout } from '../Controllers/user.js'

const router = Router()

router.route('/signup').post(newUser)
router.route('/login').post(login)
router.route('/logout').get(logout)

export default router
