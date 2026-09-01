import { Module } from '@nestjs/common';
import { WorkflowEngineService } from './services/workflow-engine.service.js';
import { WorkflowDefinitionController } from './controllers/workflow-definition.controller.js';
import { WorkflowInstanceController } from './controllers/workflow-instance.controller.js';
import { WorkflowDefinitionRepository } from './repositories/workflow-definition.repository.js';
import { WorkflowInstanceRepository } from './repositories/workflow-instance.repository.js';
import { WorkflowExecutionLogRepository } from './repositories/workflow-execution-log.repository.js';

@Module({
  imports: [],
  controllers: [WorkflowDefinitionController, WorkflowInstanceController],
  providers: [
    WorkflowEngineService,
    WorkflowDefinitionRepository,
    WorkflowInstanceRepository,
    WorkflowExecutionLogRepository,
  ],
  exports: [WorkflowEngineService],
})
export class WorkflowEngineModule {}
