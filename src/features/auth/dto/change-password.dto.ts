import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class ChangePasswordDto {
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

  @IsString({ message: 'El código debe ser un string' })
  @IsNotEmpty({ message: 'El código es requerido' })
  @Length(6, 6, { message: 'El código debe tener 6 caracteres' })
  code: string;
}
