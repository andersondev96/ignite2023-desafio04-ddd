import { Recipient } from "../entities/Recipient";
import { RecipientRepository } from "../repositories/recipient-repository";

interface RecipientUseCaseRequest {
    name: string,
    address: string,
}

export class RecipientUseCase {
    constructor(
        private recipientRepository: RecipientRepository,
    ) {}

    async execute({ name, address }: RecipientUseCaseRequest) {
        const recipient = Recipient.create({
            name,
            address
        })

        await this.recipientRepository.create(recipient)

        return recipient
    }
}