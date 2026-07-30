import { Injectable } from '@nestjs/common';
import { Role } from '../../enums/roles.enum';
import { OFFER_FORM_FIELDS } from './permissions.config';

@Injectable()
export class PermissionsService {
  getVisibleFields(userRole: Role): string[] {
    return Object.keys(OFFER_FORM_FIELDS).filter((field) =>
      OFFER_FORM_FIELDS[field].includes(userRole),
    );
  }

  canSeeField(userRole: Role, fieldName: string): boolean {
    return OFFER_FORM_FIELDS[fieldName]?.includes(userRole) ?? false;
  }
}