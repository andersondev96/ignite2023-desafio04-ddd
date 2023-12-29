import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Order } from '../../enterprise/entities/Order'
import { OrderRepository } from '../repositories/order-repository'
import { UserRepository } from '../repositories/user-repository'

interface GetOrderUseCaseRequest {
  userId: string
  orderId: string
}

type GetOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class GetOrderUseCase {
  constructor(
    private userRepository: UserRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    userId,
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.type !== 'admin') {
      return left(new NotAllowedError())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}
