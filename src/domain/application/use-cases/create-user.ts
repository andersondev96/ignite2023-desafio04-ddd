import { User } from '@/domain/enterprise/entities/User'
import { UserRepository } from '../repositories/user-repository'

interface CreateUserUseCaseRequest {
  name: string
  cpf: string
  password: string
  type: 'user' | 'admin'
}

interface CreteUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    cpf,
    password,
    type,
  }: CreateUserUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = User.create({
      name,
      cpf,
      password,
      type,
    })

    await this.userRepository.create(user)

    return {
      user,
    }
  }
}
