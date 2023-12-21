import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { User } from '@/domain/enterprise/entities/User'
import { hash } from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'

interface CreateUserUseCaseRequest {
  name: string
  cpf: string
  password: string
  type: 'user' | 'admin'
}

type CreteUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    cpf,
    password,
    type,
  }: CreateUserUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const userAlreadyExists = await this.userRepository.findByCPF(cpf)

    if (userAlreadyExists) {
      return left(new ResourceNotFoundError())
    }

    const passwordHashed = await hash(password, 6)

    const user = User.create({
      name,
      cpf,
      password: passwordHashed,
      type,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
