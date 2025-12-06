import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PayloadInterface } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  private readonly secret: string = process.env.SECRET_KEY || 'secret';
  private readonly salt = parseInt(process.env.HASH_SALT || '10', 10) || 10;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.secret,
      }),
    };
  }

  async signUp(user: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new UnauthorizedException(
        'Ya existe un usuario con ese correo electrónico',
      );
    }
    user.password = await bcrypt.hash(user.password, this.salt);

    const newUser = await this.usersService.create(user);

    const token = await this.generateToken({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
      phone: newUser.phone,
      country: newUser.country,
      full_name: newUser.full_name,
      profile_image: newUser.profile_image,
    });
    return token;
  }

  async changePassword(email: string, newPassword: string, code: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || user.code != code) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.used_code) {
      throw new UnauthorizedException('El codigo ya fue utilizado');
    }

    user.password = await bcrypt.hash(newPassword, this.salt);
    user.used_code = true;
    await this.usersService.patch(user.id, user);
  }
  
  async generateToken(payload: PayloadInterface) {
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.secret,
        expiresIn: '7d',
      }),
    };
  }
}
