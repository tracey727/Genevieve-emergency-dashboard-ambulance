import test from "node:test";
import assert from "node:assert/strict";
import {emergencyTransportConfig,emergencyTransportDashboard,emergencyTransportPeople,emergencyTransportQueue} from "../src/emergency-transport.mjs";
test("dashboard is fictional-only",()=>assert.equal(emergencyTransportDashboard().status,"FICTIONAL DATA ONLY"));
test("dashboard has open cases",()=>assert.ok(emergencyTransportDashboard().metrics.open_cases>=1));
test("people include chest pain fictional scenario",()=>assert.ok(emergencyTransportPeople().some(p=>p.change_signs.includes("Chest pain"))));
test("queue keeps primary and backup owners",()=>assert.ok(emergencyTransportQueue().every(q=>q.primary_owner&&q.backup_owner&&q.primary_owner!==q.backup_owner)));
test("config publishes release gates",async()=>assert.ok((await emergencyTransportConfig()).release_gates.includes("written production release")));
test("config prohibits autonomous dispatch",async()=>assert.ok((await emergencyTransportConfig()).non_autonomous_boundaries.includes("no autonomous dispatch")));
