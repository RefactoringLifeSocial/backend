import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  private userRepository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  patch(id: string, updateUserDto: Partial<CreateUserDto>) {
    return this.userRepository.update(id, updateUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id: id });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
