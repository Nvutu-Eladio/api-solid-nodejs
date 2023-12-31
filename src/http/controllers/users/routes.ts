import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'

export async function UserRoutes(app: FastifyInstance){
	app.post('/users', register)
	app.post('/sessions', authenticate)


	/** Authenticated */
	app.get('/me', { onRequest: [verifyJWT]} ,profile)
}

