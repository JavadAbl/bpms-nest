import { Repository } from '#common/infrastructure/database/base.repository.js';
import { PrismaProvider } from '#common/infrastructure/database/prisma.provider.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowDefinitionRepository extends Repository<'workflowDefinition'> {
  constructor(prismaProvider: PrismaProvider) {
    super('workflowDefinition', prismaProvider);
  }
}
