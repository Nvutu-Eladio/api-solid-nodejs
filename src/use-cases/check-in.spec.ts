import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'



let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		gymsRepository.items.push({
			id: 'gym-01',
			title: 'Javascript Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-23.5339472),
			longitude: new Decimal(-46.7638768)
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('Should be able to check in', async() =>{
		
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -23.5339472,
			userLongitude: -46.7638768,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('Should not be able to check in twice in the same day', async() =>{
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
        
		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -23.5339472,
			userLongitude: -46.7638768,
		})

		
		
		await expect(() => sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -23.5339472,
			userLongitude: -46.7638768,
		})).rejects.toBeInstanceOf(Error)
	})

	it('Should be able to check in twice in the different days', async() =>{
		vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
        
		await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -23.5339472,
			userLongitude: -46.7638768,
		})

		vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))
		
		const { checkIn } = await sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -23.5339472,
			userLongitude: -46.7638768,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('Should not be able to check in on distant gym', async() =>{

		gymsRepository.items.push({
			id: 'gym-02',
			title: 'Javascript Gym',
			description: '',
			phone: '',
			latitude: new Decimal(-23.5430764),
			longitude: new Decimal(-46.7617218)
			
		})
		
		await expect(() => sut.execute({
			gymId: 'gym-01',
			userId: 'user-01',
			userLatitude: -23.5514557,
			userLongitude: -46.7683744,
		})).rejects.toBeInstanceOf(Error)
	})
}) 