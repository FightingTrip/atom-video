import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@atom/shared-types/models';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
