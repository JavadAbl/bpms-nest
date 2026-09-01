export class WorkflowDefinitionDto {
  id!: number;
  key!: string;
  name!: string;
  description?: string;
  version!: number;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
