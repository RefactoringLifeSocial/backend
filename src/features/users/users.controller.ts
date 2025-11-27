import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/common/guards/acces-level.guard';
import { AccessLevel } from 'src/common/decorators/acces-level.decorators';


@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @AccessLevel('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @AccessLevel('ADMIN')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @AccessLevel('ADMIN')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
