# Ambulance V2.7 repository reconciliation — 15 October 2026

## Finding
The July V2.7 SHA256 manifest and BUILD_VERIFICATION record referenced configuration, migrations, scripts, tests, documentation and image assets that were not present in the GitHub upload on current `main`. The original upload commit and current commit contain the same incomplete package tree; therefore the missing bytes cannot be recovered from Git history alone.

## Repair approach
This branch restores runtime-equivalent configuration, database migrations, migration/readiness scripts, meaningful automated tests and an active Cloudflare Workers deployment configuration. Reconstructed files are explicitly marked where they are not byte-identical to the unavailable July ZIP.

## Active platform
GitHub + Cloudflare Workers + Neon Postgres.

Legacy Render/Vercel/Docker files remain historical provenance only and are not the active release path. `wrangler.jsonc`, `worker/index.mjs` and Required CI are the active deployment/verification path.

## Safety boundary
Fictional/coded data only until the production gates in `src/config.mjs` are all satisfied and written authority is recorded. GENEVIEVE does not replace Triple Zero, QAS CAD, clinical triage, registered clinicians, hospital authority, retrieval/aviation authority or statutory duties.

## Verification
Required CI runs Node syntax checks, the automated test suite and a Cloudflare Wrangler dry-run. A live Neon migration and live Cloudflare production deployment are separate controlled gates because they require an authenticated Neon connection and production secrets.
