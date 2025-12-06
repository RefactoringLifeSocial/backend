import { SetMetadata } from "@nestjs/common";

/**
 * @description Decorador para marcar un endpoint como publico y no requerir autenticación
 */
export const Public = () => SetMetadata("PUBLIC" , true);