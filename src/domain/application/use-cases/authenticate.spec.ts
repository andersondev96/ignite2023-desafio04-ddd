import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate an user', async () => {
    const createUser = await MakeUser()

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      cpf: createUser.cpf,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to authenticate if user not exists', async () => {
    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      password: '123456',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      cpf: '123.456.789-10',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to authenticate if password is incorrect', async () => {
    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      password: '123456',
    })

    inMemoryUsersRepository.create(createUser)

    const result = await sut.execute({
      cpf: '123.456.789-00',
      password: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
