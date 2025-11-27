import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly secret: string = process.env.SECRET_KEY || 'secret';
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  private jwtConstants = {
    secret: this.secret,
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'ACCESS_LEVEL',
      context.getHandler(),
    );

    if (!requiredRoles) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConstants.secret,
      });
      request['user'] = payload;

      return requiredRoles.includes(payload.role.toUpperCase());
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
