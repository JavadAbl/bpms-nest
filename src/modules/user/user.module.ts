import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller.js';
import { UserService } from './services/user.service.js';
import { UserRepository } from './repositories/user.repository.js';

@Module({ imports: [], controllers: [UserController], providers: [UserService, UserRepository], exports: [] })
export class UserModule {}
