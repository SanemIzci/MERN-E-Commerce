import express from 'express'
import { register, login, logout, resetPassword, forgotPassword, userDetail } from '../controllers/UserController.js'
import { authenticationMid } from '../middleware/auth.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.post('/reset/:token', resetPassword)
router.get('/me', authenticationMid, userDetail)
router.get('/logout', logout)

export default router 