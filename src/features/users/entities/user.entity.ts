import { Length } from 'class-validator';
import { UserRoleEnum } from 'src/common/enums/UserRoleEnum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column()
  country: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: 'user',
  })
  role: string;

  @Column()
  profile_image: string;

  @Column({ nullable: true })
  @Length(6, 6, { message: 'El código debe tener 6 caracteres' })
  code: string;

  @Column({
    default: false,
  })
  used_code: boolean;
}
