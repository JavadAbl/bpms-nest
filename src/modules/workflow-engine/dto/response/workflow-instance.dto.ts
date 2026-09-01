export class WorkflowInstanceDto {
  id!: number;
  definitionId!: number;
  status!: string;
  businessKey?: string;
  variables!: Record<string, any>;
  currentElements?: string[];
  startedAt!: Date;
  completedAt?: Date;
  errorMessage?: string;
}
