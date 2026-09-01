import { Controller, Get, Post, Body, Param, ParseIntPipe, Query, Patch } from '@nestjs/common';
import { WorkflowEngineService } from '../services/workflow-engine.service.js';
import { WorkflowInstanceStartDto } from '../dto/request/workflow-instance-start.dto.js';

@Controller('workflow-instances')
export class WorkflowInstanceController {
  constructor(private readonly workflowEngineService: WorkflowEngineService) {}

  @Post()
  async start(@Body() payload: WorkflowInstanceStartDto) {
    const id = await this.workflowEngineService.startInstance(payload);
    return { id };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.workflowEngineService.getInstanceById(id);
  }

  @Get()
  async getMany(@Query() query: any) {
    return this.workflowEngineService.getInstances(query);
  }

  @Patch(':id/variables')
  async updateVariables(@Param('id', ParseIntPipe) id: number, @Body() variables: Record<string, any>) {
    await this.workflowEngineService.updateInstanceVariables(id, variables);
    return { message: 'Variables updated' };
  }

  @Post(':id/complete')
  async complete(@Param('id', ParseIntPipe) id: number) {
    await this.workflowEngineService.completeInstance(id);
    return { message: 'Workflow instance completed' };
  }

  @Post(':id/fail')
  async fail(@Param('id', ParseIntPipe) id: number, @Body() body: { errorMessage: string }) {
    await this.workflowEngineService.failInstance(id, body.errorMessage);
    return { message: 'Workflow instance marked as failed' };
  }

  @Get(':id/logs')
  async getLogs(@Param('id', ParseIntPipe) id: number) {
    return this.workflowEngineService.getExecutionLogs(id);
  }
}
