'use strict';

export const QLD_HEALTH_FACILITY_CODES = Object.freeze([
  { code: 'RED', meaning: 'Fire / smoke' },
  { code: 'BLUE', meaning: 'Medical emergency' },
  { code: 'PURPLE', meaning: 'Bomb threat' },
  { code: 'YELLOW', meaning: 'Internal emergency' },
  { code: 'BLACK', meaning: 'Personal threat' },
  { code: 'BROWN', meaning: 'External emergency' },
  { code: 'ORANGE', meaning: 'Evacuation' }
]);

export const AUSTRALIAN_WARNING_LEVELS = Object.freeze([
  { level: 'ADVICE', colour: 'yellow', instruction: 'Stay informed.' },
  { level: 'WATCH AND ACT', colour: 'orange', instruction: 'Conditions are changing; act now.' },
  { level: 'EMERGENCY WARNING', colour: 'red', instruction: 'Act immediately.' }
]);

export const GENEVIEVE_ACCOUNTABILITY_STAGES = Object.freeze([
  'GREEN', 'AMBER', 'RED', 'CRITICAL', 'GOVERNANCE'
]);

export const REQUIRED_EMERGENCY_FIELDS = Object.freeze([
  'officialSource', 'incidentType', 'facilityCode', 'publicWarningLevel',
  'hazard', 'location', 'issuedAt', 'expiresAt', 'callToAction',
  'primaryOwner', 'backupOwner', 'acknowledgedAt', 'acceptedAt', 'dueAt',
  'accountabilityStage', 'actions', 'outcome', 'evidence', 'authorisedSignoff'
]);

export function validateEmergencyRecord(record) {
  const errors = [];
  for (const field of REQUIRED_EMERGENCY_FIELDS) {
    if (!(field in record)) errors.push(`Missing required field: ${field}`);
  }
  if (record.facilityCode && !QLD_HEALTH_FACILITY_CODES.some(item => item.code === record.facilityCode)) {
    errors.push('Unknown health-facility emergency code. Use approved local configuration for additions.');
  }
  if (record.publicWarningLevel && !AUSTRALIAN_WARNING_LEVELS.some(item => item.level === record.publicWarningLevel)) {
    errors.push('Unknown Australian Warning System level.');
  }
  if (record.accountabilityStage && !GENEVIEVE_ACCOUNTABILITY_STAGES.includes(record.accountabilityStage)) {
    errors.push('Unknown GENEVIEVE accountability stage.');
  }
  if (record.publicWarningLevel && !record.officialSource) {
    errors.push('An official public warning cannot be displayed without its official source.');
  }
  return { valid: errors.length === 0, errors };
}

export function assertSafetyLanguageSeparation(record) {
  return {
    incidentType: record.facilityCode || null,
    publicWarning: record.publicWarningLevel || null,
    accountability: record.accountabilityStage || null,
    rule: 'These are separate fields and must never overwrite one another.'
  };
}
