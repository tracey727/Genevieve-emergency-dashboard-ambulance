BEGIN;
CREATE TABLE IF NOT EXISTS emergency_transport_events(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL REFERENCES tenants(id),
  case_id uuid REFERENCES accountability_cases(id) ON DELETE CASCADE,
  event_class text NOT NULL CHECK(event_class IN('CALL','DISPATCH','RESOURCE','SCENE','CLINICAL','TRANSPORT','HANDOVER','INCIDENT')),
  event_state text NOT NULL,
  authority_reference text,
  evidence_reference text,
  recorded_by text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_transport_events_case_time ON emergency_transport_events(tenant_id,case_id,occurred_at,id);
ALTER TABLE emergency_transport_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS emergency_transport_events_tenant_policy ON emergency_transport_events;
CREATE POLICY emergency_transport_events_tenant_policy ON emergency_transport_events
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));
COMMIT;
