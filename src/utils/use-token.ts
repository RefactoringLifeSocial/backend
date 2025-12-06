/* eslint-disable @typescript-eslint/no-unsafe-call */
import { decode } from 'jsonwebtoken';
import { IUseToken, PayLoadTokenInterface } from 'src/features/auth/interfaces/auth.interface';

/**
 * @description Esta función recibe un token y retorna un objeto con la información del token decodificado.
 * @param token string
 */
export const useToken = (token: string): IUseToken | string => {
  try {
    const tokenWithoutBearer = token.replace('Bearer ', '');

    const decoded = decode(tokenWithoutBearer) as PayLoadTokenInterface;

    const currentDate = new Date();
    const expirationDate = new Date(decoded.exp);

    return {
      rol: decoded.rol,
      sub: decoded.sub,
      isExpired: +expirationDate <= +currentDate / 1000,
      tokenRefresh: decoded.tokenRefresh,
      name: decoded.name,
    };
  } catch (e) {
    console.log(e);
    return 'Invalid token';
  }
};
