import { User, UserProps } from '@/domain/fastfeet/enterprise/entities/User'
import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

export async function MakeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const userType: 'deliveryman' | 'admin' = 'deliveryman'

  const hashPassword = await hash('123456', 6)

  const user = User.create(
    {
      name: faker.person.firstName(),
      cpf: faker.string.uuid(),
      password: hashPassword,
      type: userType,
      ...override,
    },
    id,
  )

  return user
}
