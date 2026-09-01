import { Repository } from '#common/infrastructure/database/base.repository.js';
import { PrismaProvider } from '#common/infrastructure/database/prisma.provider.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowInstanceRepository extends Repository<'workflowInstance'> {
  constructor(prismaProvider: PrismaProvider) {
    super('workflowInstance', prismaProvider);
  }
}
