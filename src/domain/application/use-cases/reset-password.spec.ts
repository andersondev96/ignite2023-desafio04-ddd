import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { MakeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { ResetPasswordUseCase } from './reset-password'

let usersRepository: InMemoryUsersRepository
let sut: ResetPasswordUseCase

describe('Reset Password', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ResetPasswordUseCase(usersRepository)
  })

  it('should be able to reset password', async () => {
    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      type: 'admin',
    })

    usersRepository.create(createUser)

    const result = await sut.execute({
      userId: createUser.id.toString(),
      cpf: '123.456.789-00',
      oldPassword: '123456',
      newPassword: '12345678',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to reset password if user not found', async () => {
    const result = await sut.execute({
      userId: '123456',
      cpf: '123.456.789-00',
      oldPassword: '123456',
      newPassword: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to reset password if user not is admin', async () => {
    const userLogged = await MakeUser({
      name: 'User Logged',
      cpf: '111.111.111.111',
      password: '12345678',
      type: 'deliveryman',
    })

    usersRepository.create(userLogged)

    const createUser = await MakeUser({
      cpf: '123.456.789-00',
      type: 'deliveryman',
    })

    usersRepository.create(createUser)

    const result = await sut.execute({
      userId: userLogged.id.toString(),
      cpf: '123.456.789-00',
      oldPassword: '123456',
      newPassword: '12345678',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
