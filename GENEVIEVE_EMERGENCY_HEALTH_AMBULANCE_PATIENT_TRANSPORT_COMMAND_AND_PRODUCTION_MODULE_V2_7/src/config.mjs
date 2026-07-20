const trueValue = value => String(value ?? '').toLowerCase() === 'true';

export function getConfig(env = process.env) {
  const mode = env.DEPLOYMENT_MODE || 'demo';
  const production = mode === 'production';
  const gates = {
    privacyReviewApproved: trueValue(env.PRIVACY_REVIEW_APPROVED),
    clinicalGovernanceApproved: trueValue(env.CLINICAL_GOVERNANCE_APPROVED),
    cybersecurityReviewApproved: trueValue(env.CYBERSECURITY_REVIEW_APPROVED),
    incidentResponseApproved: trueValue(env.INCIDENT_RESPONSE_APPROVED),
    backupRestoreTested: trueValue(env.BACKUP_RESTORE_TESTED),
    dataLocationApproved: trueValue(env.DATA_LOCATION_APPROVED),
    roleMatrixApproved: trueValue(env.ROLE_MATRIX_APPROVED),
    emergencyProceduresApproved: trueValue(env.EMERGENCY_PROCEDURES_APPROVED),
    insuranceReviewCompleted: trueValue(env.INSURANCE_REVIEW_COMPLETED),
    accessibilityTested: trueValue(env.ACCESSIBILITY_TESTED),
  };
  const missing = [];
  if (production && !env.DATABASE_URL) missing.push('DATABASE_URL');
  if (production && (!env.JWT_SECRET || env.JWT_SECRET.length < 32)) missing.push('JWT_SECRET (minimum 32 characters)');
  if (production && !env.PUBLIC_BASE_URL?.startsWith('https://')) missing.push('PUBLIC_BASE_URL using HTTPS');
  if (production && (!env.CRON_SECRET || env.CRON_SECRET.length < 16)) missing.push('CRON_SECRET (minimum 16 characters)');
  for (const [key, value] of Object.entries(gates)) if (production && !value) missing.push(key);
  return {
    mode, production, port: Number(env.PORT || 8080),
    databaseUrl: env.DATABASE_URL || '', databaseSsl: env.DATABASE_SSL !== 'false',
    jwtSecret: env.JWT_SECRET || '', jwtIssuer: env.JWT_ISSUER || 'genevieve-health',
    jwtAudience: env.JWT_AUDIENCE || 'genevieve-health-users',
    trustedProxyAuth: trueValue(env.TRUSTED_PROXY_AUTH),
    cronSecret: env.CRON_SECRET || '', escalationWorkerEnabled: env.ESCALATION_WORKER_ENABLED !== 'false',
    publicBaseUrl: env.PUBLIC_BASE_URL || 'http://localhost:8080',
    defaultTenantId: env.DEFAULT_TENANT_ID || 'tenant-demo-health',
    defaultTenantName: env.DEFAULT_TENANT_NAME || 'GENEVIEVE Emergency Health, Ambulance & Patient Transport Fictional Service',
    allowedOrigins: (env.CORS_ALLOWED_ORIGINS || '').split(',').map(x=>x.trim()).filter(Boolean),
    gates, missing, ready: !production || missing.length === 0,
  };
}

export function assertProductionSafe(config) {
  if (config.production && !config.ready) {
    const error = new Error(`Production start blocked. Missing: ${config.missing.join(', ')}`);
    error.code = 'PRODUCTION_NOT_READY';
    throw error;
  }
}
