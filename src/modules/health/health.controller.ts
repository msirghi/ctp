import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DNSHealthIndicator, HealthCheck, HealthCheckService } from "@nestjs/terminus";

@Controller("health")
@ApiTags("Health")
export class HealthController {
  constructor(private health: HealthCheckService, private dns: DNSHealthIndicator) {}

  @Get()
  @HealthCheck()
  @ApiOkResponse()
  check() {
    return this.health.check([() => this.dns.pingCheck("CTP-Backend", "http://localhost:3000/api/v1/countries")]);
  }
}
