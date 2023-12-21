import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { UserRepository } from '../repositories/user-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type CreteUserUseCaseResponse = Either<ResourceNotFoundError, {}>

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    await this.userRepository.delete(user)

    return right({})
  }
}
