import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Recipient } from '../../enterprise/entities/Recipient'
import { RecipientRepository } from '../repositories/recipient-repository'
import { UserRepository } from '../repositories/user-repository'

interface CreateRecipientUseCaseRequest {
  userId: string
  name: string
  address: string
}

type CreateRecipientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient
  }
>

export class CreateRecipientUseCase {
  constructor(
    private usersRepository: UserRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    userId,
    name,
    address,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (user.type !== 'admin') {
      return left(new NotAllowedError())
    }

    const recipient = Recipient.create({
      name,
      address,
    })

    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
