export const TYPES = {
  // Repositories
  IAuthRepository: Symbol.for("IAuthRepository"),
  IContractRepository: Symbol.for("IContractRepository"),
  IPropertyRepository: Symbol.for("IPropertyRepository"),
  IAmenityRepository: Symbol.for("IAmenityRepository"),

  // Services
  IAuthService: Symbol.for("IAuthService"),
  IContractService: Symbol.for("IContractService"),
  IPropertyService: Symbol.for("IPropertyService"),
  IDashboardService: Symbol.for("IDashboardService"),
  IActivityService: Symbol.for("IActivityService"),
  IRevenueService: Symbol.for("IRevenueService"),
  IAmenityService: Symbol.for("IAmenityService"),
  IHttpClient: Symbol.for("IHttpClient"),
} as const;
