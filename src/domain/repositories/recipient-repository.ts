import { Recipient } from '../entities/Recipient'

export interface RecipientRepository {
  findById(id: string): Promise<Recipient | null>
  create(recipient: Recipient): Promise<void>
  save(recipient: Recipient): Promise<void>
  delete(recipient: Recipient): Promise<void>
}
