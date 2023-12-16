import { Entity } from '../../core/entities/entity'
import { UniqueEntityId } from '../../core/entities/unique-entity-id'

enum StatusOrder {
  WAITING,
  WITHDRAWN,
  DELIVERED,
  RETURNED,
}

interface OrderProps {
  recipientId: UniqueEntityId
  deliverymanId: UniqueEntityId
  product: string
  details: string
  status: StatusOrder
  createdAt: Date
  withdrawnDate?: Date
  deliveryDate?: Date
  image?: string
}

export class Order extends Entity<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  get product() {
    return this.props.product
  }

  get details() {
    return this.props.details
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get withdrawDate() {
    return this.props.withdrawDate
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  get image() {
    return this.props.image
  }

  static create(props: OrderProps, id?: UniqueEntityId) {
    const order = new Order(props, id)

    return order
  }
}
