import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'


let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym  Use Case', () => {

	beforeEach(() =>{
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(gymsRepository)
	})

	it('Should be able to create gym', async() =>{
		
		const { gym } = await sut.execute({
			title: 'Javascript Gym',
			description: null,
			phone: null,
			latitude: -23.5339472,
			longitude: -46.7638768,
		})

		expect(gym.id).toEqual(expect.any(String))
	})


	
}) 