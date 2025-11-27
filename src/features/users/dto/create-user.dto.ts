import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsStrongPassword,
  MaxLength,
  IsNumberString,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El email debe ser un string' })
  @IsEmail({}, { message: 'El email debe ser un email válido' })
  @Length(5, 100, { message: 'El email debe tener entre 5 y 100 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  email: string;

  @IsString({ message: 'El password debe ser un string' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número',
    },
  )
  @MaxLength(30, {
    message: 'La contraseña debe tener como máximo 50 caracteres',
  })
  password: string;

  @IsString({ message: 'El nombre completo debe ser un string' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @Length(3, 50, {
    message: 'El nombre completo debe tener entre 3 y 50 caracteres',
  })
  full_name: string;

  @IsString({ message: 'El país debe ser un string' })
  @IsNotEmpty({ message: 'El país es requerido' })
  @Length(3, 50, {
    message: 'El país debe tener entre 3 y 50 caracteres',
  })
  country: string;

  @IsString({ message: 'La dirección debe ser un string' })
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @Length(5, 100, {
    message: 'La dirección debe tener entre 5 y 100 caracteres',
  })
  address: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString()
  @IsNumberString(
    {
      no_symbols: false,
    },
    { message: 'El teléfono debe ser un número' },
  )
  @Length(8, 15, {
    message: 'El teléfono debe tener entre 8 y 15 caracteres',
  })
  phone: string;

  @IsString({ message: 'La imagen de perfil debe ser un string' })
  @IsNotEmpty({ message: 'La imagen de perfil es requerida' })
  @Length(5, 100, {
    message: 'La imagen de perfil debe tener entre 5 y 100 caracteres',
  })
  profile_image: string;
}
