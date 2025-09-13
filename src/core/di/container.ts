import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// Repositories
import { IAuthRepository } from "../repositories/interfaces/IAuthRepository";
import { AuthRepository } from "../repositories/implementations/AuthRepository";
import { IContractRepository } from "../repositories/interfaces/IContractRepository";
import { ContractRepository } from "../repositories/implementations/ContractRepository";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { PropertyRepository } from "../repositories/implementations/PropertyRepository";
import { IAmenityRepository } from "../repositories/interfaces/IAmenityRepository";
import { AmenityRepository } from "../repositories/implementations/AmenityRepository";

// Services
import { IAuthService } from "../services/interfaces/IAuthService";
import { AuthService } from "../services/implementations/AuthService";
import { IContractService } from "../services/interfaces/IContractService";
import { ContractService } from "../services/implementations/ContractService";
import { IPropertyService } from "../services/interfaces/IPropertyService";
import { PropertyService } from "../services/implementations/PropertyService";
import { IDashboardService } from "../services/interfaces/IDashboardService";
import { DashboardService } from "../services/implementations/DashboardService";
import { IActivityService } from "../services/interfaces/IActivityService";
import { ActivityService } from "../services/implementations/ActivityService";
import { IRevenueService } from "../services/interfaces/IRevenueService";
import { RevenueService } from "../services/implementations/RevenueService";
import { IAmenityService } from "../services/AmenityService";
import { AmenityService } from "../services/AmenityService";
import { IHttpClient } from "../repositories/interfaces/IHttpClient";
import { HttpClient } from "../repositories/implementations/HttpClient";

// Container Inversify
const container = new Container();

// Enregistrement du HttpClient
container.bind<IHttpClient>(TYPES.IHttpClient).to(HttpClient);

// Enregistrement des repositories
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
container
  .bind<IContractRepository>(TYPES.IContractRepository)
  .to(ContractRepository);
container
  .bind<IPropertyRepository>(TYPES.IPropertyRepository)
  .to(PropertyRepository);
container
  .bind<IAmenityRepository>(TYPES.IAmenityRepository)
  .to(AmenityRepository);

// Enregistrement des services avec injection de dépendances
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IContractService>(TYPES.IContractService).to(ContractService);
container.bind<IPropertyService>(TYPES.IPropertyService).to(PropertyService);
container.bind<IDashboardService>(TYPES.IDashboardService).to(DashboardService);
container.bind<IActivityService>(TYPES.IActivityService).to(ActivityService);
container.bind<IRevenueService>(TYPES.IRevenueService).to(RevenueService);
container.bind<IAmenityService>(TYPES.IAmenityService).to(AmenityService);

export { container };

// Fonctions utilitaires pour récupérer les services
export const getHttpClient = (): IHttpClient => {
  return container.get<IHttpClient>(TYPES.IHttpClient);
};

export const getAuthRepository = (): IAuthRepository => {
  return container.get<IAuthRepository>(TYPES.IAuthRepository);
};

export const getContractRepository = (): IContractRepository => {
  return container.get<IContractRepository>(TYPES.IContractRepository);
};

export const getAuthService = (): IAuthService => {
  return container.get<IAuthService>(TYPES.IAuthService);
};

export const getContractService = (): IContractService => {
  return container.get<IContractService>(TYPES.IContractService);
};

export const getPropertyRepository = (): IPropertyRepository => {
  return container.get<IPropertyRepository>(TYPES.IPropertyRepository);
};

export const getPropertyService = (): IPropertyService => {
  return container.get<IPropertyService>(TYPES.IPropertyService);
};

export const getDashboardService = (): IDashboardService => {
  return container.get<IDashboardService>(TYPES.IDashboardService);
};

export const getActivityService = (): IActivityService => {
  return container.get<IActivityService>(TYPES.IActivityService);
};

export const getRevenueService = (): IRevenueService => {
  return container.get<IRevenueService>(TYPES.IRevenueService);
};

export const getAmenityService = (): IAmenityService => {
  return container.get<IAmenityService>(TYPES.IAmenityService);
};
