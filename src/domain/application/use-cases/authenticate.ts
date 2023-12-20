import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { User } from '@/domain/enterprise/entities/User'
import { compare } from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export class AuthenticateUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByCPF(cpf)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const verifyPassword = await compare(password, user.password)

    if (!verifyPassword) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user,
    })
  }
}
