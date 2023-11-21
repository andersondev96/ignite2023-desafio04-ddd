import { Recipient } from "../entities/Recipient";
import { RecipientRepository } from "../repositories/recipient-repository";
import { RecipientUseCase } from "./recipient";

const fakeRecipientsRepository: RecipientRepository = {
    create: async (recipient: Recipient) => {
        return;
    }
}

test('create a new recipient', async () => {
    const recipientUseCase = new RecipientUseCase(fakeRecipientsRepository)

    const recipient = await recipientUseCase.execute({
        name: 'John Doe',
        address: 'Address Example'
    })

    expect(recipient.name).toEqual('John Doe')
})