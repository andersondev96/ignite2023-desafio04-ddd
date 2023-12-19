import { UserCaseError } from '../use-case-error'

export class ResourceNotFoundError extends Error implements UserCaseError {
  constructor() {
    super('Resource not found')
  }
}
