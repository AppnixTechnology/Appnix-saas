import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller(['health', 'api/v1/health'])
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Backend Health Check & Database Connectivity Status' })
  check() {
    return this.healthService.checkHealth();
  }
}
