import { Module } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesGuard],
  imports: [UsersModule]
})
export class AuthModule {}
