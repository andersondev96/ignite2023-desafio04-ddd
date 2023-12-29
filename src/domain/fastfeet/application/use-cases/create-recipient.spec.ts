import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateRecipientUseCase } from './create-recipient'

let usersRepository: InMemoryUsersRepository
let recipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe('Create recipient', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    recipientRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(usersRepository, recipientRepository)
  })

  it('should be able to  create a new recipient', async () => {
    const user = await MakeUser({
      type: 'admin',
    })

    usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'John Doe',
      address: 'Address Example',
    })

    expect(result.isRight()).toEqual(true)
  })

  it('should not be able to  create a new recipient if user not found', async () => {
    const result = await sut.execute({
      userId: '123456',
      name: 'John Doe',
      address: 'Address Example',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  create a new recipient if user not is admin', async () => {
    const user = await MakeUser({
      type: 'deliveryman',
    })

    usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'John Doe',
      address: 'Address Example',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
