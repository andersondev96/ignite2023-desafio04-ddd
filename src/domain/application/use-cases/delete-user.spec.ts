import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(usersRepository)
  })

  it('should be able to delete an user', async () => {
    const createUser = await MakeUser()

    usersRepository.create(createUser)

    await sut.execute({
      userId: createUser.id.toString(),
    })

    expect(usersRepository.items).toHaveLength(0)
  })
})
