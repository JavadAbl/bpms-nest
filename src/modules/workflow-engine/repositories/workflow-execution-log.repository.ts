import { Repository } from '#common/infrastructure/database/base.repository.js';
import { PrismaProvider } from '#common/infrastructure/database/prisma.provider.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowExecutionLogRepository extends Repository<'workflowExecutionLog'> {
  constructor(prismaProvider: PrismaProvider) {
    super('workflowExecutionLog', prismaProvider);
  }
}
