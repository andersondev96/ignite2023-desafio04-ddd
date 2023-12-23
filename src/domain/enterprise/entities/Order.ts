import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export enum StatusOrder {
  WAITING,
  WITHDRAWN,
  DELIVERED,
  RETURNED,
}

export interface OrderProps {
  recipientId: UniqueEntityId
  deliverymanId: UniqueEntityId
  product: string
  details: string
  status?: StatusOrder | undefined
  createdAt: Date
  withdrawnDate?: Date | undefined
  deliveryDate?: Date | undefined
  image?: string | undefined
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

  set product(product: string) {
    this.props.product = product
  }

  get details() {
    return this.props.details
  }

  set details(details: string) {
    this.props.details = details
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
  }

  get withdrawDate() {
    return this.props.withdrawDate
  }

  set withdrawDate(withdrawDate: string) {
    this.props.withdrawDate = withdrawDate
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  set deliveryDate(deliveryDate: string) {
    this.props.deliveryDate = deliveryDate
  }

  get image() {
    return this.props.image
  }

  set image(image: string) {
    this.props.image = image
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: OrderProps, id?: UniqueEntityId) {
    const order = new Order(props, id)

    return order
  }
}
