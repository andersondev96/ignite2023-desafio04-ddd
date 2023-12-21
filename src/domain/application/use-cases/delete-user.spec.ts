import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
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

  it('should not be able to delete an inexistent user', async () => {
    const result = await sut.execute({
      userId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
