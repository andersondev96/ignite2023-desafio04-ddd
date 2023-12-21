import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Recipient } from '@/domain/enterprise/entities/Recipient'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRepository } from '../repositories/user-repository'

interface GetRecipientUseCaseRequest {
  userId: string
  recipientId: string
}

type CreteUserUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class GetRecipientUseCase {
  constructor(
    private userRepository: UserRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    userId,
    recipientId,
  }: GetRecipientUseCaseRequest): Promise<CreteUserUseCaseResponse> {
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

    return right({
      recipient,
    })
  }
}
