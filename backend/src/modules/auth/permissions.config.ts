import { Role } from '../../enums/roles.enum';

export interface FormFieldVisibility {
  [fieldName: string]: Role[];
}

export const OFFER_FORM_FIELDS: FormFieldVisibility = {
  executive_code: [Role.WS, Role.ASM, Role.KAS, Role.SAM, Role.WSM, Role.ADMIN],
  money_offered: [Role.WS, Role.ASM, Role.KAS, Role.SAM, Role.WSM, Role.ADMIN],
  commercial_input: [Role.SAM, Role.WSM, Role.CM, Role.ADMIN],
  approval_comments: [Role.CM, Role.VPB2B, Role.DA, Role.DF, Role.RF, Role.RVP, Role.ADMIN],
  customer_detail: [Role.WS, Role.ASM, Role.KAS, Role.ADMIN],
};