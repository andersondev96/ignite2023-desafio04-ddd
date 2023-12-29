import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetRecipientUseCase } from './get-recipient'

let usersRepository: InMemoryUsersRepository
let recipientsRepository: InMemoryRecipientRepository
let sut: GetRecipientUseCase

describe('Update Recipient', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    recipientsRepository = new InMemoryRecipientRepository()
    sut = new GetRecipientUseCase(usersRepository, recipientsRepository)
  })

  it('should be able to update recipient', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })
    const createRecipient = await MakeRecipient()

    usersRepository.create(createUser)
    recipientsRepository.create(createRecipient)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      recipientId: createRecipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(recipientsRepository.items).toHaveLength(1)
  })

  it('should not be able to update recipient if user not found', async () => {
    const result = await sut.execute({
      userId: '123456',
      recipientId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update recipient if user not is admin', async () => {
    const createUser = await MakeUser({
      type: 'deliveryman',
    })

    usersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      recipientId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to update recipient not found', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    usersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      recipientId: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
