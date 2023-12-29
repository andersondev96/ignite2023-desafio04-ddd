import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateOrderUseCase } from './create-order'

let userRepository: InMemoryUsersRepository
let recipientRepository: InMemoryRecipientRepository
let orderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    recipientRepository = new InMemoryRecipientRepository()
    orderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(
      userRepository,
      recipientRepository,
      orderRepository,
    )
  })

  it('should be able to create a new order', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    const createRecipient = await MakeRecipient()

    await userRepository.create(createUser)
    await recipientRepository.create(createRecipient)

    const result = await sut.execute({
      deliverymanId: createUser.id.toString(),
      recipientId: createRecipient.id.toString(),
      product: 'New Product',
      details: 'Product Details',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to  create a new order if deliveryman not found', async () => {
    const createRecipient = await MakeRecipient()

    await recipientRepository.create(createRecipient)

    const result = await sut.execute({
      deliverymanId: '123456',
      recipientId: createRecipient.id.toString(),
      product: 'New Product',
      details: 'Product Details',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  create a new order if user not is admin', async () => {
    const createUser = await MakeUser({
      type: 'deliveryman',
    })

    await userRepository.create(createUser)

    const createRecipient = await MakeRecipient()

    await recipientRepository.create(createRecipient)

    const result = await sut.execute({
      deliverymanId: createUser.id.toString(),
      recipientId: createRecipient.id.toString(),
      product: 'New Product',
      details: 'Product Details',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to  create a new order if recipient not found', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    await userRepository.create(createUser)

    const result = await sut.execute({
      deliverymanId: '123456',
      recipientId: '123456',
      product: 'New Product',
      details: 'Product Details',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
