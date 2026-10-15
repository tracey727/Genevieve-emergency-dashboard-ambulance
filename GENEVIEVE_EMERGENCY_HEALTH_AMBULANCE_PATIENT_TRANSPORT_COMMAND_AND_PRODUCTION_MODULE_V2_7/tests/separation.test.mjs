import test from "node:test";
import assert from "node:assert/strict";
import {ROLE_PERMISSIONS} from "../src/rbac.mjs";
test("patient cannot manage dispatch",()=>assert.equal(ROLE_PERMISSIONS.patient.includes("manage_dispatch"),false));
test("dispatcher can escalate",()=>assert.equal(ROLE_PERMISSIONS.emergency_medical_dispatcher.includes("escalate_case"),true));
test("auditor cannot treat",()=>assert.equal(ROLE_PERMISSIONS.auditor.includes("record_treatment"),false));
