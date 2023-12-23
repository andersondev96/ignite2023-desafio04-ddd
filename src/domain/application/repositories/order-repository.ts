import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '@/domain/enterprise/entities/Order'

export interface OrderRepository {
  findById(id: string): Promise<Order | null>
  findManyByUserId(userId: string, params: PaginationParams): Promise<Order[]>
  create(order: Order): Promise<void>
  save(order: Order): Promise<void>
  delete(order: Order): Promise<void>
}
