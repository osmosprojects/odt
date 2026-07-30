import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Role } from '../../enums/roles.enum';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private permissions: PermissionsService) {}

  @Get('form-fields')
  getFormFields(@Req() req: Request) {
    const userRole = (req as any).user?.role as Role;
    return {
      role: userRole,
      visibleFields: this.permissions.getVisibleFields(userRole),
    };
  }
}