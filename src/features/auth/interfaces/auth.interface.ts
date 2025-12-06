import { UserRoleEnum } from 'src/common/enums/UserRoleEnum';

export class PayLoadToken {
  rol: UserRoleEnum;
  sub: string;
  name: string;
  tipo_de_cuenta: string;
  tokenRefresh: string;
  city_id: number | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface AuthInterface {
  payload: PayLoadToken;
  accesToken: string;
}

export interface PayLoadTokenInterface {
  rol: string;
  sub: string;
  name: string;
  iat: number;
  exp: number;
  tokenRefresh: string;
}

export interface IUseToken {
  rol: string;
  sub: string;
  isExpired: boolean;
  tokenRefresh: string;
  name: string;
}
