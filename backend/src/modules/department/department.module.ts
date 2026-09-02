import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { RolesController } from './roles.controller';
import { DepartmentAnalyticsController } from './department-analytics.controller';
import { DepartmentService } from './department.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    DepartmentsController,
    RolesController,
    DepartmentAnalyticsController,
  ],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
