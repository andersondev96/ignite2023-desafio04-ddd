import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { RecipientUseCase } from './recipient'

let recipientRepository: InMemoryRecipientRepository
let sut: RecipientUseCase

describe('create recipient', () => {
  beforeEach(() => {
    recipientRepository = new InMemoryRecipientRepository()
    sut = new RecipientUseCase(recipientRepository)
  })

  it('should be able to  create a new recipient', async () => {
    const recipient = await sut.execute({
      name: 'John Doe',
      address: 'Address Example',
    })

    expect(recipient.name).toEqual('John Doe')
  })
})
