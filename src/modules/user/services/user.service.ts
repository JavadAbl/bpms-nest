import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/response/user.dto.js';
import { UserUpdateDto } from '../dto/request/user-update.dto.js';
import { UserCreateDto } from '../dto/request/user-create.dto.js';
import { GetManyReply } from '#common/dto/response/get-many-reply.js';
import { GetManyQueryType } from '#common/dto/request/get-many-query.js';
import { UserRepository } from '../repositories/user.repository.js';
import { buildFindManyArgs } from '#common/utils/prisma-util.js';

@Injectable()
export class UserService {
  constructor(private readonly userRep: UserRepository) {}

  async userGetById(id: number): Promise<UserDto> {
    const user = await this.userRep.findAndCheckExistsBy({ where: { id } }, 'id', id);
    return plainToInstance(UserDto, user);
  }

  async userGetMany(query: GetManyQueryType<'User'>): Promise<GetManyReply<UserDto>> {
    const predicate = buildFindManyArgs(query, { searchableFields: ['name'] });
    const { items, totalCount } = await this.userRep.findMany(predicate);
    return { items, totalCount };
  }

  async userCreate(payload: UserCreateDto): Promise<number> {
    const { name } = payload;
    await this.userRep.checkDuplicateBy({ where: { name } }, 'name', name);
    const user = await this.userRep.create({ data: payload });
    return user.id;
  }

  async userUpdate(userId: number, payload: UserUpdateDto): Promise<void> {
    const { name } = payload;
    await this.userRep.findAndCheckExistsBy({ where: { name } }, 'name', name);
    await this.userRep.update({ data: payload, where: { id: userId } });
  }
}
