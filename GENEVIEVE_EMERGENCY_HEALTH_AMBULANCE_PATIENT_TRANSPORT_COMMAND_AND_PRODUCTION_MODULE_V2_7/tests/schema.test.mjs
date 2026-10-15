import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
test("core schema has tenant RLS",async()=>{const s=await fs.readFile(new URL("../database/migrations/001_core.sql",import.meta.url),"utf8");assert.match(s,/ENABLE ROW LEVEL SECURITY/);});
test("core schema has append-only event table",async()=>{const s=await fs.readFile(new URL("../database/migrations/001_core.sql",import.meta.url),"utf8");assert.match(s,/CREATE TABLE IF NOT EXISTS case_events/);});
test("core schema separates primary and backup owners",async()=>{const s=await fs.readFile(new URL("../database/migrations/001_core.sql",import.meta.url),"utf8");assert.match(s,/CHECK\(primary_owner_id<>backup_owner_id\)/);});
