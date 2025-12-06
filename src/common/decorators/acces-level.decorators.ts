import { SetMetadata } from "@nestjs/common";
import { UserRoleEnum } from "src/common/enums/UserRoleEnum";

/**
 * @description Decorador para marcar un endpoint con roles y no requerir autenticación
 */
export const AccessLevel = (...roles: Array<keyof typeof UserRoleEnum> ) => SetMetadata("ACCESS_LEVEL" , roles);