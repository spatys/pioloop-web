export const TYPES = {
  // Repositories
  IAuthRepository: Symbol.for('IAuthRepository'),
  IContractRepository: Symbol.for('IContractRepository'),

  // Services
  IAuthService: Symbol.for('IAuthService'),
  IContractService: Symbol.for('IContractService'),
  IHttpClient: Symbol.for('IHttpClient'),
} as const; 