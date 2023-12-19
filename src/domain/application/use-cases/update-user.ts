import { User } from '@/domain/enterprise/entities/User'
import { UserRepository } from '../repositories/user-repository'

interface UpdateUserUseCaseRequest {
  userId: string
  name: string
  cpf: string
  password: string
  type: 'user' | 'admin'
}

interface CreteUserUseCaseResponse {
  user: User
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    name,
    cpf,
    password,
    type,
  }: UpdateUserUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    await this.userRepository.save(user)

    return {
      user,
    }
  }
}
