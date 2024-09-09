import { Hono } from 'hono'
import { AuthService } from '../services/auth.js'

const authService = new AuthService()
export const authRouter = new Hono()
