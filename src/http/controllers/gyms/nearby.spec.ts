import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'


describe('Nearby Gyms (e2e)', ()=>{
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(() => {
		app.close()
	})

	it('should be able to list nearby gyms', async () => {
		const { token } = await createAndAuthenticateUser(app)

		

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Javascript Gym',
				description: 'Some description',
				phone: '11913316398',
				latitude: -23.5704292,
				longitude: -46.646104,
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'TypeScript Gym',
				description: 'Some description',
				phone: '11913316398',
				latitude: -30.044132,
				longitude: -51.2147004,
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -23.5704292,
				longitude: -46.646104,
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(201)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Javascript Gym',
			}),
		])
		
	})
})