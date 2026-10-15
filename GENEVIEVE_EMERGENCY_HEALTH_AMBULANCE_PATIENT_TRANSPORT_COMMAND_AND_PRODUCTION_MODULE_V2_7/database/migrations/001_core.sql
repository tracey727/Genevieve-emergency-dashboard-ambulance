BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tenants(
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accountability_cases(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL REFERENCES tenants(id),
  sector_id text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  stage text NOT NULL CHECK(stage IN('GREEN','AMBER','RED','CRITICAL','GOVERNANCE')),
  status text NOT NULL CHECK(status IN('OPEN','ASSIGNED','ACCEPTED','ACTIONED','UNDER_REVIEW','CLOSED')),
  primary_owner_id text NOT NULL,
  backup_owner_id text NOT NULL,
  due_at timestamptz NOT NULL,
  stage_due_at timestamptz,
  accepted_at timestamptz,
  accepted_by text,
  action_summary text,
  outcome_summary text,
  residual_risk text,
  escalation_count integer NOT NULL DEFAULT 0,
  governance_signoff_by text,
  governance_signoff_at timestamptz,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  CHECK(primary_owner_id<>backup_owner_id)
);
CREATE INDEX IF NOT EXISTS idx_cases_tenant_status_due ON accountability_cases(tenant_id,status,stage_due_at);

CREATE TABLE IF NOT EXISTS case_events(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL REFERENCES tenants(id),
  case_id uuid NOT NULL REFERENCES accountability_cases(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  actor_id text NOT NULL,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_case_events_case_time ON case_events(case_id,occurred_at,id);

ALTER TABLE accountability_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS accountability_cases_tenant_policy ON accountability_cases;
CREATE POLICY accountability_cases_tenant_policy ON accountability_cases
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

DROP POLICY IF EXISTS case_events_tenant_policy ON case_events;
CREATE POLICY case_events_tenant_policy ON case_events
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

INSERT INTO tenants(id,name) VALUES('tenant-demo-health','GENEVIEVE Emergency Health Fictional Service')
ON CONFLICT(id) DO NOTHING;
COMMIT;
