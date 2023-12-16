import { Recipient } from 'src/domain/entities/Recipient'
import { RecipientRepository } from 'src/domain/repositories/recipient-repository'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async findById(id: string) {
    throw new Error('Method not implemented.')
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
