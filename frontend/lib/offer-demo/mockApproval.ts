export interface DofaRule {
  level: string;
  minVolume: number;
  maxVolume: number;
  minGmpl: number;
  approver: string;
}

export const mockDofaRules: DofaRule[] = [
  { level: "L1", minVolume: 0, maxVolume: 10000, minGmpl: 22, approver: "Territory Manager" },
  { level: "L2", minVolume: 10001, maxVolume: 30000, minGmpl: 19, approver: "Regional Sales Manager" },
  { level: "L3", minVolume: 30001, maxVolume: 60000, minGmpl: 18, approver: "National Sales Lead / VP" },
  { level: "L4", minVolume: 60001, maxVolume: 150000, minGmpl: 16, approver: "Commercial Director / CFO" },
  { level: "L5", minVolume: 150001, maxVolume: 9999999, minGmpl: 14, approver: "Managing Director" }
];

export function determineDofaLevel(volume: number, gmpl: number): { level: string; approver: string } {
  // Loop through rules, find the matching one
  // Typically, DOFA level increases (becomes stricter) if volume is high or GMPL is low.
  // Let's implement a simple logic:
  // Level is determined by volume first, then if GMPL is below the threshold, it escalates to next level.
  let levelIdx = 0;
  
  if (volume <= 10000) levelIdx = 0; // L1
  else if (volume <= 30000) levelIdx = 1; // L2
  else if (volume <= 60000) levelIdx = 2; // L3
  else if (volume <= 150000) levelIdx = 3; // L4
  else levelIdx = 4; // L5

  // GMPL Escalation
  // If GMPL is below the target minGmpl for this level, escalate it!
  const rule = mockDofaRules[levelIdx];
  if (gmpl < rule.minGmpl && levelIdx < 4) {
    levelIdx += 1;
  }

  const finalRule = mockDofaRules[levelIdx];
  return {
    level: finalRule.level,
    approver: finalRule.approver
  };
}
