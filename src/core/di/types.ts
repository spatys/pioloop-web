export const TYPES = {
  // Repositories
  IAuthRepository: Symbol.for("IAuthRepository"),
  IContractRepository: Symbol.for("IContractRepository"),
  IPropertyRepository: Symbol.for("IPropertyRepository"),

  // Services
  IAuthService: Symbol.for("IAuthService"),
  IContractService: Symbol.for("IContractService"),
  IPropertyService: Symbol.for("IPropertyService"),
  IHttpClient: Symbol.for("IHttpClient"),
} as const;
