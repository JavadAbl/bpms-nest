import { IsString, MaxLength, Length, IsOptional, IsBoolean } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
