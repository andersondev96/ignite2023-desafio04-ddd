import { RecipientRepository } from '@/domain/application/repositories/recipient-repository'
import { Recipient } from '@/domain/enterprise/entities/Recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async findById(id: string) {
    throw new Error('Method not implemented.')
    return null
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async save(recipient: Recipient) {
    throw new Error('Method not implemented.')
  }

  async delete(recipient: Recipient) {
    throw new Error('Method not implemented.')
  }
}
