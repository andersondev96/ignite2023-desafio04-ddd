import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/Order'

export class StatusOrderUpdatedEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.order = order
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
