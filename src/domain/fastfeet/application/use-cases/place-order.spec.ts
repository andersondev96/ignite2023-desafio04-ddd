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
import { PlaceOrderUseCase } from './place-order'

let userRepository: InMemoryUsersRepository
let recipientRepository: InMemoryRecipientRepository
let orderRepository: InMemoryOrderRepository
let sut: PlaceOrderUseCase

describe('Place Order', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    recipientRepository = new InMemoryRecipientRepository()
    orderRepository = new InMemoryOrderRepository()
    sut = new PlaceOrderUseCase(userRepository, orderRepository)
  })

  it('should be able to place order to delivered', async () => {
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
      userId: createUser.id.toString(),
      orderId: createOrder.id.toString(),
      status: StatusOrder.DELIVERED,
      image: 'image-1.png',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should be able to place order to waiting', async () => {
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
      userId: createUser.id.toString(),
      orderId: createOrder.id.toString(),
      status: StatusOrder.WAITING,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to place order to delivered if image is nullable', async () => {
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
      userId: createUser.id.toString(),
      orderId: createOrder.id.toString(),
      status: StatusOrder.DELIVERED,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to  place order if user is different deliveryman user id', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    const createRecipient = await MakeRecipient()

    const createOrder = await MakeOrder({
      deliverymanId: new UniqueEntityId('user-deliveryman-id'),
      recipientId: new UniqueEntityId(createRecipient.id.toString()),
    })

    await userRepository.create(createUser)
    await recipientRepository.create(createRecipient)
    await orderRepository.create(createOrder)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      orderId: createOrder.id.toString(),
      status: StatusOrder.DELIVERED,
      image: 'image-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to  place order if order not found', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    await userRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      orderId: 'order-not-found',
      status: StatusOrder.DELIVERED,
      image: 'image-1',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  place order if user not found', async () => {
    const result = await sut.execute({
      userId: 'user-not-found',
      orderId: '123456',
      status: StatusOrder.DELIVERED,
      image: 'image-1',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to place order if user not is admin', async () => {
    const createUser = await MakeUser({
      type: 'deliveryman',
    })

    await userRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      orderId: '123456',
      status: StatusOrder.DELIVERED,
      image: 'image-1',
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
