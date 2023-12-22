import { Order } from '@/domain/enterprise/entities/Order'

export interface OrderRepository {
  findById(id: string): Promise<Order | null>
  create(order: Order): Promise<void>
  save(order: Order): Promise<void>
  delete(order: Order): Promise<void>
}
