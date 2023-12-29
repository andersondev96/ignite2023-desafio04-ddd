import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Order, StatusOrder } from '../../enterprise/entities/Order'
import { OrderRepository } from '../repositories/order-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRepository } from '../repositories/user-repository'

interface CreateOrderUseCaseRequest {
  recipientId: string
  deliverymanId: string
  product: string
  details: string
  image?: string
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

export class CreateOrderUseCase {
  constructor(
    private userRepository: UserRepository,
    private recipientRepository: RecipientRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    recipientId,
    deliverymanId,
    product,
    details,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
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

    const order = Order.create({
      recipientId: new UniqueEntityId(recipientId),
      deliverymanId: new UniqueEntityId(deliverymanId),
      product,
      details,
      status: StatusOrder.WAITING,
      createdAt: new Date(),
    })

    await this.orderRepository.create(order)

    return right({
      order,
    })
  }
}
