import test from "node:test";
import assert from "node:assert/strict";
import {getConfig,assertProductionSafe} from "../src/config.mjs";
test("demo starts without production secrets",()=>assert.equal(getConfig({}).ready,true));
test("production fails closed without database",()=>{const c=getConfig({DEPLOYMENT_MODE:"production"});assert.equal(c.ready,false);assert.ok(c.missing.includes("DATABASE_URL"));});
test("production requires long jwt",()=>assert.ok(getConfig({DEPLOYMENT_MODE:"production",DATABASE_URL:"postgres://x",JWT_SECRET:"short"}).missing.some(x=>x.startsWith("JWT_SECRET"))));
test("assertProductionSafe blocks incomplete production",()=>assert.throws(()=>assertProductionSafe(getConfig({DEPLOYMENT_MODE:"production"}))));

test("production accepts Hyperdrive connection string",()=>{
  const c=getConfig({
    DEPLOYMENT_MODE:"production",
    HYPERDRIVE:{connectionString:"postgres://runtime@example/neondb"},
    JWT_SECRET:"12345678901234567890123456789012",
    PUBLIC_BASE_URL:"https://genevieve-ambulance-v2-7.workers.dev",
    CRON_SECRET:"1234567890123456",
    PRIVACY_REVIEW_APPROVED:"true",
    CLINICAL_GOVERNANCE_APPROVED:"true",
    CYBERSECURITY_REVIEW_APPROVED:"true",
    INCIDENT_RESPONSE_APPROVED:"true",
    BACKUP_RESTORE_TESTED:"true",
    DATA_LOCATION_APPROVED:"true",
    ROLE_MATRIX_APPROVED:"true",
    EMERGENCY_PROCEDURES_APPROVED:"true",
    INSURANCE_REVIEW_COMPLETED:"true",
    ACCESSIBILITY_TESTED:"true"
  });
  assert.equal(c.databaseUrl,"postgres://runtime@example/neondb");
  assert.equal(c.ready,true);
});
