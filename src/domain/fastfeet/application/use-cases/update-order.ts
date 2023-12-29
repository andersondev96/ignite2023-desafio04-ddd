import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Order, StatusOrder } from '../../enterprise/entities/Order'
import { OrderRepository } from '../repositories/order-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRepository } from '../repositories/user-repository'

interface UpdateOrderUseCaseRequest {
  deliverymanId: string
  recipientId: string
  orderId: string
  product: string
  details: string
  status?: StatusOrder | undefined
  image?: string | undefined
}

type UpdateOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class UpdateOrderUseCase {
  constructor(
    private userRepository: UserRepository,
    private recipientRepository: RecipientRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    deliverymanId,
    recipientId,
    orderId,
    product,
    details,
    status,
    image,
  }: UpdateOrderUseCaseRequest): Promise<UpdateOrderUseCaseResponse> {
    const deliveryman = await this.userRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    if (deliveryman.type !== 'admin') {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.product = product
    order.details = details

    if (status) {
      order.status = status.toString()
    }

    if (image) {
      order.image = image
    }

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
