import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { compare, hash } from 'bcryptjs'
import { User } from '../../enterprise/entities/User'
import { UserRepository } from '../repositories/user-repository'

interface ResetPasswordUseCaseRequest {
  userId: string
  cpf: string
  oldPassword: string
  newPassword: string
}

type ResetPasswordUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    user: User
  }
>

export class ResetPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    cpf,
    oldPassword,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.type !== 'admin') {
      return left(new NotAllowedError())
    }

    const findUser = await this.userRepository.findByCPF(cpf)

    if (!findUser) {
      return left(new ResourceNotFoundError())
    }

    const verifyPassword = await compare(oldPassword, user.password)

    if (!verifyPassword) {
      return left(new NotAllowedError())
    }

    const hashPassword = await hash(newPassword, 6)

    findUser.password = hashPassword

    await this.userRepository.save(findUser)

    return right({
      user,
    })
  }
}
