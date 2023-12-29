import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { User } from '../../enterprise/entities/User'
import { UserRepository } from '../repositories/user-repository'

interface GetProfileUseCaseRequest {
  userId: string
}

type GetProfileUseCaseResponse = Either<
  NotAllowedError,
  {
    user: User
  }
>

export class GetProfileUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new NotAllowedError())
    }

    return right({
      user,
    })
  }
}
