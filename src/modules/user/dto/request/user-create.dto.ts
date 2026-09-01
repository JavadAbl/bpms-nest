import { IsString, IsNotEmpty, MaxLength, Length } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
