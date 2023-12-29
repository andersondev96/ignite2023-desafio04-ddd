import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { MakeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchOrderByDeliverymanUseCase } from './fetch-order-by-deliveryman'

let orderRepository: InMemoryOrderRepository
let sut: FetchOrderByDeliverymanUseCase

describe('Fetch Order By Deliveryman', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new FetchOrderByDeliverymanUseCase(orderRepository)
  })

  it('should be able to fetch order by deliveryman', async () => {
    await orderRepository.create(
      await MakeOrder({
        deliverymanId: new UniqueEntityId('user-1'),
      }),
    )

    await orderRepository.create(
      await MakeOrder({
        deliverymanId: new UniqueEntityId('user-1'),
      }),
    )

    await orderRepository.create(
      await MakeOrder({
        deliverymanId: new UniqueEntityId('user-1'),
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
    })

    expect(result.value?.orders).toHaveLength(3)
  })

  it('should be able to fetch pagination orders by deliveryman', async () => {
    for (let i = 0; i <= 22; i++) {
      await orderRepository.create(
        await MakeOrder({
          deliverymanId: new UniqueEntityId('user-1'),
        }),
      )
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(3)
  })
})
