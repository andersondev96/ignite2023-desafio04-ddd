import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeOrder } from 'test/factories/make-order'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { GetOrderUseCase } from './get-order'

let userRepository: InMemoryUsersRepository
let orderRepository: InMemoryOrderRepository
let sut: GetOrderUseCase

describe('Get Order', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    orderRepository = new InMemoryOrderRepository()
    sut = new GetOrderUseCase(userRepository, orderRepository)
  })

  it('should be able to get order', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    const createOrder = await MakeOrder()

    await userRepository.create(createUser)
    await orderRepository.create(createOrder)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      orderId: createOrder.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(orderRepository.items).toHaveLength(1)
  })

  it('should not be able to get order if user not found', async () => {
    const createOrder = await MakeOrder()
    await orderRepository.create(createOrder)

    const result = await sut.execute({
      userId: '123456',
      orderId: createOrder.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to  create a new order if user not is admin', async () => {
    const createUser = await MakeUser({
      type: 'deliveryman',
    })
    const createOrder = await MakeOrder()

    await userRepository.create(createUser)
    await orderRepository.create(createOrder)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      orderId: createOrder.id.toString(),
    })

    expect(result.isLeft()).toEqual(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
