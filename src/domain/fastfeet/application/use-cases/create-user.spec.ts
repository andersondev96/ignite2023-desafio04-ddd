import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
      type: 'admin',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to create an user if user already exists', async () => {
    const newUser = await MakeUser({
      cpf: '123.456.789-00',
    })

    await inMemoryUsersRepository.create(newUser)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: newUser.cpf,
      password: '123456',
      type: 'admin',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
