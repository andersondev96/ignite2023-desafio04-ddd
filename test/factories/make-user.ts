import { faker } from '@faker-js/faker'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { User, UserProps } from 'src/domain/entities/User'

export function MakeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const userType: 'user' | 'admin' = 'user'

  const user = User.create(
    {
      name: faker.person.firstName(),
      cpf: faker.string.uuid(),
      password: faker.lorem.slug(),
      type: userType,
      ...override,
    },
    id,
  )

  return user
}
