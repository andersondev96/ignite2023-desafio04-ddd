import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeOrder } from 'test/factories/make-order'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { StatusOrder } from '../../enterprise/entities/Order'
import { UpdateOrderUseCase } from './update-order'

let userRepository: InMemoryUsersRepository
let recipientRepository: InMemoryRecipientRepository
let orderRepository: InMemoryOrderRepository
let sut: UpdateOrderUseCase

describe('Update Order', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    recipientRepository = new InMemoryRecipientRepository()
    orderRepository = new InMemoryOrderRepository()
    sut = new UpdateOrderUseCase(
      userRepository,
      recipientRepository,
      orderRepository,
    )
  })

  it('should be able to update order', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    const createRecipient = await MakeRecipient()

    const createOrder = await MakeOrder({
      deliverymanId: new UniqueEntityId(createUser.id.toString()),
      recipientId: new UniqueEntityId(createRecipient.id.toString()),
    })

    await userRepository.create(createUser)
    await recipientRepository.create(createRecipient)
    await orderRepository.create(createOrder)

    const result = await sut.execute({
      deliverymanId: createUser.id.toString(),
      recipientId: createRecipient.id.toString(),
      orderId: createOrder.id.toString(),
      product: 'Product Updated',
      details: 'Details updated',
      status: StatusOrder.DELIVERED,
      image: 'Image Updated',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to  update order if deliveryman not found', async () => {
    const result = await sut.execute({
      deliverymanId: '123456',
      recipientId: '123456',
      orderId: '123456',
      product: 'Product Updated',
      details: 'Details updated',
      status: StatusOrder.DELIVERED,
      image: 'Image Updated',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  update order if user not is admin', async () => {
    const createUser = await MakeUser({
      type: 'deliveryman',
    })

    await userRepository.create(createUser)

    const result = await sut.execute({
      deliverymanId: createUser.id.toString(),
      recipientId: '123456',
      orderId: '123456',
      product: 'Product Updated',
      details: 'Details updated',
      status: StatusOrder.DELIVERED,
      image: 'Image Updated',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to  update order if recipient not found', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    await userRepository.create(createUser)

    const result = await sut.execute({
      deliverymanId: createUser.id.toString(),
      recipientId: '12345678',
      orderId: '1234567',
      product: 'Product Updated',
      details: 'Details updated',
      status: StatusOrder.DELIVERED,
      image: 'Image Updated',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  update order if order not found', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    const createRecipient = await MakeRecipient()

    await userRepository.create(createUser)
    await recipientRepository.create(createRecipient)

    const result = await sut.execute({
      deliverymanId: createUser.id.toString(),
      recipientId: createRecipient.id.toString(),
      orderId: '1234567',
      product: 'Product Updated',
      details: 'Details updated',
      status: StatusOrder.DELIVERED,
      image: 'Image Updated',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
