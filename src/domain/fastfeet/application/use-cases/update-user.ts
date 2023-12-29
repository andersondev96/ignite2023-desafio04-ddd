import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { hash } from 'bcryptjs'
import { User } from '../../enterprise/entities/User'
import { UserRepository } from '../repositories/user-repository'

interface UpdateUserUseCaseRequest {
  userId: string
  name: string
  cpf: string
  password: string
}

type UpdateUserUseCaseResponse = Either<
  ResourceNotFoundError,
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
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
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
