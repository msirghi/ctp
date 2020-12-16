import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestPayload } from 'src/common/types';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProblemsAuditService } from './problemsAudit.service';

@Controller('/problems/actions')
@ApiTags('Problems Audit')
export class ProblemsAuditController {
  constructor(private readonly problemsAuditService: ProblemsAuditService) {}

  @Get()
  @UseGuards(AuthGuard)
  getUserActions(@Request() req: RequestPayload) {
    return this.problemsAuditService.getActionsByUser(req.userId);
  }
}
