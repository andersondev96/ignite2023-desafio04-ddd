import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { compare } from 'bcryptjs'
import { User } from '../../enterprise/entities/User'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
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
      return left(new NotAllowedError())
    }

    return right({
      user,
    })
  }
}
