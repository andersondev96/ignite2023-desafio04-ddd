import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UpdateUserUseCase } from './update-user'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserUseCase

describe('Update User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserUseCase(usersRepository)
  })

  it('should be able to update an user', async () => {
    const createUser = await MakeUser()

    usersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      name: 'John Doe',
      cpf: '123.456.789-00',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
  })
})
