import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'


describe('Authenticate Use Case', () => {
	it('Should be able to authenticate', async() =>{
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		})

		const { user } = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong email', async() =>{
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		expect(() => 
			sut.execute({        
				email: 'johndoe@example.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
		
	})

	it('Should not be able to authenticate with wrong password', async() =>{
		const usersRepository = new InMemoryUsersRepository()
		const sut = new AuthenticateUseCase(usersRepository)

		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hash('123456', 6),
		})

		expect(() => 
			sut.execute({        
				email: 'johndoe@example.com',
				password: '123123',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
		
	})
	
}) 