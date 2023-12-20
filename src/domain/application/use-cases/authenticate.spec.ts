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
})
