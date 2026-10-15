import test from "node:test";
import assert from "node:assert/strict";
import {STAGES,NEXT_STAGE,nextStage,nextStageDueAt,validateNewCase,closureGaps} from "../src/accountability.mjs";

test("stage order is locked",()=>assert.deepEqual(STAGES,["GREEN","AMBER","RED","CRITICAL","GOVERNANCE"]));
test("next stage progresses",()=>assert.equal(nextStage("RED"),"CRITICAL"));
test("governance stays governance",()=>assert.equal(nextStage("GOVERNANCE"),"GOVERNANCE"));
test("critical deadline is five minutes",()=>assert.equal(nextStageDueAt("CRITICAL",new Date("2026-01-01T00:00:00Z")),"2026-01-01T00:05:00.000Z"));
test("governance has no further deadline",()=>assert.equal(nextStageDueAt("GOVERNANCE"),null));
test("new case rejects same owners",()=>assert.throws(()=>validateNewCase({sectorId:"x",title:"x",summary:"x",primaryOwnerId:"a",backupOwnerId:"a",dueAt:new Date().toISOString()})));
test("closure requires governance evidence",()=>{const gaps=closureGaps({accepted_at:null},{},{});assert.ok(gaps.includes("owner acceptance"));assert.ok(gaps.includes("governance authorisation"));});
