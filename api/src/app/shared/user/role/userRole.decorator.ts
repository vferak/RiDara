import { SetMetadata } from '@nestjs/common';
import { UserRole } from './userRole.enum';

export const USER_ROLES_KEY = 'user-roles';
export const UserRoles = (...roles: UserRole[]) =>
    SetMetadata(USER_ROLES_KEY, roles);
