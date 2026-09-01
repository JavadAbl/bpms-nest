import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service.js';

@Controller('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
