// src/modules/approval/approval-workflow.service.ts
// PHP equivalent: $getLevel, $levelRole array — DOFA (Delegation of Financial Authority)
import { Injectable, BadRequestException } from '@nestjs/common';
import { Role } from '../../enums/roles.enum';

export interface ApprovalStep {
  level: number;
  role: Role;
  isFinal: boolean;
}

// The DOFA chain, in order — each level's approver role
const DOFA_CHAIN: Role[] = [
  Role.WS,
  Role.RWM,
  Role.CM,
  Role.VPB2B,
  Role.DA,
  Role.DF,
  Role.RF,
  Role.RVP,
];

@Injectable()
export class ApprovalWorkflowService {
  // PHP equivalent: $getLevel() — returns the role responsible for the NEXT approval level
  getNextApprover(currentLevel: number): ApprovalStep {
    const nextLevel = currentLevel + 1;

    if (nextLevel > DOFA_CHAIN.length) {
      throw new BadRequestException('Offer has already completed the full approval chain');
    }

    const role = DOFA_CHAIN[nextLevel - 1]; // levels are 1-indexed, array is 0-indexed
    return {
      level: nextLevel,
      role,
      isFinal: nextLevel === DOFA_CHAIN.length,
    };
  }

  // Validates that the person attempting to approve is actually the correct role for this level
  canApprove(currentLevel: number, userRole: Role): boolean {
    const nextLevel = currentLevel + 1;
    if (nextLevel > DOFA_CHAIN.length) return false;
    return DOFA_CHAIN[nextLevel - 1] === userRole;
  }

  getChainLength(): number {
    return DOFA_CHAIN.length;
  }

  getRoleAtLevel(level: number): Role | null {
    if (level < 1 || level > DOFA_CHAIN.length) return null;
    return DOFA_CHAIN[level - 1];
  }
}