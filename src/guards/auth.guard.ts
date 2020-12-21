import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new HttpException('Not authenticated.', HttpStatus.UNAUTHORIZED);
    }

    try {
      const token = authorization.split(' ')[1];
      const { userId, role, usname } = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      request.userId = userId;
      request.role = role;
      request.usname = usname;
      return true;
    } catch (e) {
      return false;
    }
  }
}
