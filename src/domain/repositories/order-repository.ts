import { Order } from "../entities/Order";

export interface OrderRepository {
    create(order: Order): Promise<void>
}