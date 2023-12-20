import { Either, right } from '@/core/either'
import { UserRepository } from '../repositories/user-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type CreteUserUseCaseResponse = Either<null, {}>

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    await this.userRepository.delete(user)

    return right({})
  }
}
