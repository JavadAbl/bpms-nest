import { Injectable, Logger } from '@nestjs/common';
import { WorkflowDefinitionRepository } from '../repositories/workflow-definition.repository.js';
import { WorkflowInstanceRepository } from '../repositories/workflow-instance.repository.js';
import { WorkflowExecutionLogRepository } from '../repositories/workflow-execution-log.repository.js';
import { WorkflowDefinitionCreateDto } from '../dto/request/workflow-definition-create.dto.js';
import { WorkflowInstanceStartDto } from '../dto/request/workflow-instance-start.dto.js';
import { plainToInstance } from 'class-transformer';
import { WorkflowDefinitionDto } from '../dto/response/workflow-definition.dto.js';
import { WorkflowInstanceDto } from '../dto/response/workflow-instance.dto.js';
import { GetManyQueryType } from '#common/dto/request/get-many-query.js';
import { GetManyReply } from '#common/dto/response/get-many-reply.js';
import { buildFindManyArgs } from '#common/utils/prisma-util.js';

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(
    private readonly workflowDefinitionRepo: WorkflowDefinitionRepository,
    private readonly workflowInstanceRepo: WorkflowInstanceRepository,
    private readonly workflowExecutionLogRepo: WorkflowExecutionLogRepository,
  ) {}

  // === Workflow Definition Operations ===

  async createDefinition(payload: WorkflowDefinitionCreateDto): Promise<number> {
    const { key } = payload;
    await this.workflowDefinitionRepo.checkDuplicateBy({ where: { key } }, 'key', key);
    const definition = await this.workflowDefinitionRepo.create({ data: payload });
    return definition.id;
  }

  async getDefinitionById(id: number): Promise<WorkflowDefinitionDto> {
    const definition = await this.workflowDefinitionRepo.findAndCheckExistsBy(
      { where: { id } },
      'id',
      id,
    );
    return plainToInstance(WorkflowDefinitionDto, definition);
  }

  async getDefinitions(query: GetManyQueryType<'WorkflowDefinition'>): Promise<GetManyReply<WorkflowDefinitionDto>> {
    const predicate = buildFindManyArgs(query, { searchableFields: ['key', 'name'] });
    const { items, totalCount } = await this.workflowDefinitionRepo.findMany(predicate);
    return { items: items.map(item => plainToInstance(WorkflowDefinitionDto, item)), totalCount };
  }

  async deactivateDefinition(id: number): Promise<void> {
    await this.workflowDefinitionRepo.update({ data: { active: false }, where: { id } });
  }

  // === Workflow Instance Operations ===

  async startInstance(payload: WorkflowInstanceStartDto): Promise<number> {
    const { definitionKey, businessKey, variables = {} } = payload;

    // Find the active workflow definition
    const definition = await this.workflowDefinitionRepo.findFirst({
      where: { key: definitionKey, active: true },
    });

    if (!definition) {
      throw new Error(`Active workflow definition with key "${definitionKey}" not found`);
    }

    // Create workflow instance
    const instance = await this.workflowInstanceRepo.create({
      data: {
        definitionId: definition.id,
        status: 'pending',
        businessKey,
        variables: JSON.stringify(variables),
      },
    });

    // Log instance start
    await this.logEvent(instance.id, 'instance_start', null, null, `Workflow instance started for definition ${definitionKey}`);

    // Start the BPMN engine
    await this.executeWorkflow(instance.id, definition.definition, variables);

    return instance.id;
  }

  async getInstanceById(id: number): Promise<WorkflowInstanceDto> {
    const instance = await this.workflowInstanceRepo.findAndCheckExistsBy(
      { where: { id } },
      'id',
      id,
    );
    
    const dto = plainToInstance(WorkflowInstanceDto, instance);
    dto.variables = JSON.parse(instance.variables);
    if (instance.currentElements) {
      dto.currentElements = JSON.parse(instance.currentElements);
    }
    return dto;
  }

  async getInstances(query: GetManyQueryType<'WorkflowInstance'>): Promise<GetManyReply<WorkflowInstanceDto>> {
    const predicate = buildFindManyArgs(query, { searchableFields: ['status', 'businessKey'] });
    const { items, totalCount } = await this.workflowInstanceRepo.findMany(predicate);
    
    const dtos = items.map(item => {
      const dto = plainToInstance(WorkflowInstanceDto, item);
      dto.variables = JSON.parse(item.variables);
      if (item.currentElements) {
        dto.currentElements = JSON.parse(item.currentElements);
      }
      return dto;
    });
    
    return { items: dtos, totalCount };
  }

  async updateInstanceVariables(instanceId: number, variables: Record<string, any>): Promise<void> {
    const instance = await this.workflowInstanceRepo.findAndCheckExistsBy(
      { where: { id: instanceId } },
      'id',
      instanceId,
    );

    const currentVars = JSON.parse(instance.variables);
    const updatedVars = { ...currentVars, ...variables };

    await this.workflowInstanceRepo.update({
      data: { variables: JSON.stringify(updatedVars) },
      where: { id: instanceId },
    });

    await this.logEvent(instanceId, 'variable_update', null, null, 'Variables updated');
  }

  async completeInstance(instanceId: number): Promise<void> {
    await this.workflowInstanceRepo.update({
      data: { 
        status: 'completed',
        completedAt: new Date(),
      },
      where: { id: instanceId },
    });

    await this.logEvent(instanceId, 'instance_completed', null, null, 'Workflow instance completed');
  }

  async failInstance(instanceId: number, errorMessage: string): Promise<void> {
    await this.workflowInstanceRepo.update({
      data: { 
        status: 'failed',
        errorMessage,
      },
      where: { id: instanceId },
    });

    await this.logEvent(instanceId, 'instance_failed', null, null, errorMessage);
  }

  // === Execution Log Operations ===

  async getExecutionLogs(instanceId: number): Promise<any[]> {
    const logs = await this.workflowExecutionLogRepo.findMany({
      where: { instanceId },
      orderBy: { createdAt: 'asc' },
    });
    return logs.items;
  }

  // === Private Methods ===

  private async logEvent(
    instanceId: number,
    eventType: string,
    elementId?: string | null,
    elementName?: string | null,
    message?: string | null,
    details?: Record<string, any> | null,
  ): Promise<void> {
    await this.workflowExecutionLogRepo.create({
      data: {
        instanceId,
        eventType,
        elementId,
        elementName,
        message,
        details: details ? JSON.stringify(details) : null,
      },
    });
  }

  private async executeWorkflow(
    instanceId: number,
    bpmnXml: string,
    variables: Record<string, any>,
  ): Promise<void> {
    try {
      // Update status to running
      await this.workflowInstanceRepo.update({
        data: { status: 'running' },
        where: { id: instanceId },
      });

      // Here you would integrate with bpmn-engine or similar
      // For now, we'll simulate a simple workflow execution
      this.logger.log(`Executing workflow instance ${instanceId} with BPMN definition`);
      
      // TODO: Integrate with bpmn-engine library
      // const engine = new BpmnEngine();
      // await engine.execute(bpmnXml, { variables, listener: ... });

      // For demonstration, mark as completed
      await this.completeInstance(instanceId);
    } catch (error: any) {
      this.logger.error(`Workflow execution failed: ${error.message}`);
      await this.failInstance(instanceId, error.message);
      throw error;
    }
  }
}
