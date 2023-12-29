import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Order, StatusOrder } from '../../enterprise/entities/Order'
import { OrderRepository } from '../repositories/order-repository'
import { UserRepository } from '../repositories/user-repository'

interface PlaceOrderUseCaseRequest {
  userId: string
  orderId: string
  status: StatusOrder
  image?: string
}

type PlaceOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order
  }
>

export class PlaceOrderUseCase {
  constructor(
    private userRepository: UserRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    userId,
    orderId,
    status,
    image,
  }: PlaceOrderUseCaseRequest): Promise<PlaceOrderUseCaseResponse> {
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

    if (
      (status === StatusOrder.DELIVERED &&
        user.id.toString() !== order.deliverymanId.toString()) ||
      (status === StatusOrder.DELIVERED && !image)
    ) {
      return left(new NotAllowedError())
    }

    order.status = status.toString()

    if (image) {
      order.image = image
    }

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
