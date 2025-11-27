import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/acces-level.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AccessLevel } from 'src/common/decorators/acces-level.decorators';

@UseGuards(AuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: CreateUserDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @AccessLevel('USER', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch('change-password')
  async changePassword(
    @Body() body: { email: string; newPassword: string; code: string },
  ) {
    return this.authService.changePassword(
      body.email,
      body.newPassword,
      body.code,
    );
  }
}
