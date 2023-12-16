import { User } from 'src/domain/entities/User'
import { UserRepository } from 'src/domain/repositories/user-repository copy'

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = []

  async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(user: User): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
