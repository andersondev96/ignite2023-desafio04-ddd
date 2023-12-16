import { User } from '../entities/User'
import { UserRepository } from '../repositories/user-repository copy'

interface CreateUserUseCaseRequest {
  name: string
  cpf: string
  password: string
  type: 'user' | 'admin'
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, cpf, password, type }: CreateUserUseCaseRequest) {
    const user = User.create({
      name,
      cpf,
      password,
      type,
    })

    await this.userRepository.create(user)
  }
}
