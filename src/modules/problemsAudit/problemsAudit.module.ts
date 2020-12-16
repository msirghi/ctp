import { Module } from '@nestjs/common';
import { ProblemsAuditService } from './problemsAudit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProblemAudit, ProblemAuditSchema } from './schema/problemsAudit.schema';
import { ProblemsAuditController } from './problemsAudit.controller';

@Module({
  providers: [ProblemsAuditService],
  controllers: [ProblemsAuditController],
  exports: [ProblemsAuditService],
  imports: [MongooseModule.forFeature([{ name: ProblemAudit.name, schema: ProblemAuditSchema }])]
})
export class ProblemsAuditModule {}
