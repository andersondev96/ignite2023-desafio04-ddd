import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { StatusOrder } from '@/domain/fastfeet/enterprise/entities/Order'
import { MakeOrder } from 'test/factories/make-order'
import { MakeRecipient } from 'test/factories/make-recipient'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { waitFor } from 'test/utils/waitFor'
import { SpyInstance } from 'vitest'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnStatusOrderUpdated } from './on-status-order-updated'

let orderRepository: InMemoryOrderRepository
let notificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpyOn: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Status Order Updated', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    notificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
    )

    sendNotificationExecuteSpyOn = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnStatusOrderUpdated(orderRepository, sendNotificationUseCase)
  })

  it('should send a notification when an order status is updated', async () => {
    const createUser = await MakeUser({
      type: 'admin',
    })

    const createRecipient = await MakeRecipient()

    const createOrder = await MakeOrder({
      deliverymanId: new UniqueEntityId(createUser.id.toString()),
      recipientId: new UniqueEntityId(createRecipient.id.toString()),
    })

    await orderRepository.create(createOrder)

    createOrder.status = StatusOrder.DELIVERED.toString()

    await orderRepository.save(createOrder)

    await waitFor(() => {
      expect(sendNotificationExecuteSpyOn).toHaveBeenCalled()
    })
  })
})
