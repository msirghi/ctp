import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || process.env.NODE_ENV === 'dev') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return !!roles.find((role) => role.toLowerCase() === request.role.toLowerCase());
  }
}
