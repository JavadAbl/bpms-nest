import { IsString, IsOptional, IsObject } from 'class-validator';

export class WorkflowInstanceStartDto {
  @IsString()
  definitionKey!: string;

  @IsOptional()
  @IsString()
  businessKey?: string;

  @IsOptional()
  @IsObject()
  variables?: Record<string, any>;
}
