BEGIN;
INSERT INTO tenants(id,name) VALUES('tenant-demo-health','GENEVIEVE Emergency Health Fictional Service')
ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name;
COMMIT;
