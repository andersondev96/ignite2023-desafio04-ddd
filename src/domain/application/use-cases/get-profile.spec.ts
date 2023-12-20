import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetProfileUserUseCase } from './get-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetProfileUserUseCase

describe('Get Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetProfileUserUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createUser = await MakeUser()

    usersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items).toHaveLength(1)
  })
})
