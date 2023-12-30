import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/fastfeet/application/repositories/order-repository'
import { Order } from '@/domain/fastfeet/enterprise/entities/Order'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.deliverymanId.toString() === userId)
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
