import { SetMetadata } from '@nestjs/common';
import { Role } from '../../enums/roles.enum';

export const ROLES_KEY = 'roles';

// PHP equivalent: if (!in_array($sessionRole, ['WS','ASM','KAS'])) { exit; }
// Usage: @Roles(Role.WS, Role.ASM, Role.KAS)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
