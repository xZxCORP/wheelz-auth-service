import { Context, Hono } from 'hono'
import { logger } from 'hono/logger'

import { helloRouter } from './routes/hello.js'
import { authRouter } from './routes/auth.js'
import { HTTPException } from 'hono/http-exception'

export const app = new Hono()
app.use(logger())

app.onError((error: Error, c: Context) => {
    console.error('error', error)
    return error instanceof HTTPException
      ? c.json({ message: error.message, data: error.cause }, error.status)
      : c.json({ message: 'Server error' }, 500)
})

app.route('/hello', helloRouter)
app.route('/', authRouter)
