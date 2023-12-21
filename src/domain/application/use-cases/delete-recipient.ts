import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRepository } from '../repositories/user-repository'

interface DeleteRecipientUseCaseRequest {
  userId: string
  recipientId: string
}

type CreteUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteRecipientUseCase {
  constructor(
    private userRepository: UserRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    userId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<CreteUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.type !== 'admin') {
      return left(new NotAllowedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientRepository.delete(recipient)

    return right({})
  }
}
