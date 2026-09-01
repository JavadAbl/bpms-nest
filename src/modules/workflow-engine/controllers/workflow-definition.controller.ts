import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { WorkflowEngineService } from '../services/workflow-engine.service.js';
import { WorkflowDefinitionCreateDto } from '../dto/request/workflow-definition-create.dto.js';
import { WorkflowInstanceStartDto } from '../dto/request/workflow-instance-start.dto.js';

@Controller('workflow-definitions')
export class WorkflowDefinitionController {
  constructor(private readonly workflowEngineService: WorkflowEngineService) {}

  @Post()
  async create(@Body() payload: WorkflowDefinitionCreateDto) {
    const id = await this.workflowEngineService.createDefinition(payload);
    return { id };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.workflowEngineService.getDefinitionById(id);
  }

  @Get()
  async getMany(@Query() query: any) {
    return this.workflowEngineService.getDefinitions(query);
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    await this.workflowEngineService.deactivateDefinition(id);
    return { message: 'Workflow definition deactivated' };
  }
}
