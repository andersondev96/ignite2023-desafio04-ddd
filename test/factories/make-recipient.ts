import {
  Recipient,
  RecipientProps,
} from '@/domain/fastfeet/enterprise/entities/Recipient'
import { faker } from '@faker-js/faker'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

export async function MakeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.firstName(),
      address: faker.location.streetAddress(),
      ...override,
    },
    id,
  )

  return recipient
}
