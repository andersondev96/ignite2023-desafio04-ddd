import { Either, right } from '@/core/either'
import { User } from '@/domain/enterprise/entities/User'
import { hash } from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'

interface UpdateUserUseCaseRequest {
  userId: string
  name: string
  cpf: string
  password: string
}

type CreteUserUseCaseResponse = Either<
  null,
  {
    user: User
  }
>

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    name,
    cpf,
    password,
  }: UpdateUserUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const hashPassword = await hash(password, 6)

    user.name = name
    user.cpf = cpf
    user.password = hashPassword

    await this.userRepository.save(user)

    return right({
      user,
    })
  }
}
