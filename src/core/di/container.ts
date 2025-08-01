import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories
import { IAuthRepository } from '../repositories/interfaces/IAuthRepository';
import { AuthRepository } from '../repositories/implementations/AuthRepository';
import { IContractRepository } from '../repositories/interfaces/IContractRepository';
import { ContractRepository } from '../repositories/implementations/ContractRepository';

// Services
import { IAuthService } from '../services/interfaces/IAuthService';
import { AuthService } from '../services/implementations/AuthService';
import { IContractService } from '../services/interfaces/IContractService';
import { ContractService } from '../services/implementations/ContractService';
import { IHttpClient } from '../repositories/interfaces/IHttpClient';
import { HttpClient } from '../repositories/implementations/HttpClient';

// Container Inversify
const container = new Container();

// Enregistrement du HttpClient
container.bind<IHttpClient>(TYPES.IHttpClient).to(HttpClient);

// Enregistrement des repositories
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
container.bind<IContractRepository>(TYPES.IContractRepository).to(ContractRepository);

// Enregistrement des services avec injection de dépendances
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IContractService>(TYPES.IContractService).to(ContractService);

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