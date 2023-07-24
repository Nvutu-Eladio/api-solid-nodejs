import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'


export class InMemoryGymsRepository implements GymsRepository {
	// Criando um array de usuários vazio para simular o db
	public items: Gym[] = []

	async findById(id: string) {
		const gym = this.items.find((item) => item.id === id)

		if (!gym) {
			return null
		}

		return gym
	}

}