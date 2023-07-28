import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nerby Gyms Use Case', () => {
	beforeEach(async () => {
		// Aqui é onde iremos dar o valor as variáveis criadas

		// Instanciando o banco de dados in memory criado para os testes
		gymsRepository = new InMemoryGymsRepository()

		// Instanciando o caso de uso
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		// Criando DOIS check in
		await gymsRepository.create({
			title: 'Near GYM',
			description: null,
			phone: null,
			latitude: -23.5704292,
			longitude: -46.646104,
		})

		await gymsRepository.create({
			title: 'Far GYM',
			description: null,
			phone: null,
			latitude: -30.044132,
			longitude: -51.2147004,
		})

		const { gyms } = await sut.execute({
			userLatitude: -23.569656,
			userLongitude: -46.6477816,
		})

		// Esperando que exista um registros
		expect(gyms).toHaveLength(1)

		expect(gyms).toEqual([expect.objectContaining({ title: 'Near GYM' })])
	})

})

