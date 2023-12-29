import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/Order'
import { OrderRepository } from '../repositories/order-repository'

interface FetchOrderByDeliverymanUseCaseRequest {
  userId: string
  page: number
}

type FetchOrderByDeliverymanUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

export class FetchOrderByDeliverymanUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    userId,
    page,
  }: FetchOrderByDeliverymanUseCaseRequest): Promise<FetchOrderByDeliverymanUseCaseResponse> {
    const orders = await this.orderRepository.findManyByUserId(userId, {
      page,
    })

    return right({
      orders,
    })
  }
}
