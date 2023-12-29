import {
  Order,
  OrderProps,
  StatusOrder,
} from '@/domain/fastfeet/enterprise/entities/Order'
import { faker } from '@faker-js/faker'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

export async function MakeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityId(),
      deliverymanId: new UniqueEntityId(),
      product: faker.commerce.product(),
      details: faker.commerce.productDescription(),
      status: StatusOrder.WAITING,
      createdAt: new Date(),
      ...override,
    },
    id,
  )

  return order
}
