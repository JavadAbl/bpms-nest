import { IsString, IsOptional, IsObject } from 'class-validator';

export class WorkflowDefinitionCreateDto {
  @IsString()
  key!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  definition!: string; // BPMN XML
}
