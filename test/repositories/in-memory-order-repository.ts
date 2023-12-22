import { OrderRepository } from '@/domain/application/repositories/order-repository'
import { Order } from '@/domain/enterprise/entities/Order'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async findById(id: string) {
    return null
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async save(order: Order) {
    throw new Error('Method not implemented.')
  }

  async delete(order: Order) {
    throw new Error('Method not implemented.')
  }
}
