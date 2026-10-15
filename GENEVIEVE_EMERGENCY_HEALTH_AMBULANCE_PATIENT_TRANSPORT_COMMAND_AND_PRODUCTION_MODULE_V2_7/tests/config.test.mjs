import test from "node:test";
import assert from "node:assert/strict";
import {getConfig,assertProductionSafe} from "../src/config.mjs";
test("demo starts without production secrets",()=>assert.equal(getConfig({}).ready,true));
test("production fails closed without database",()=>{const c=getConfig({DEPLOYMENT_MODE:"production"});assert.equal(c.ready,false);assert.ok(c.missing.includes("DATABASE_URL"));});
test("production requires long jwt",()=>assert.ok(getConfig({DEPLOYMENT_MODE:"production",DATABASE_URL:"postgres://x",JWT_SECRET:"short"}).missing.some(x=>x.startsWith("JWT_SECRET"))));
test("assertProductionSafe blocks incomplete production",()=>assert.throws(()=>assertProductionSafe(getConfig({DEPLOYMENT_MODE:"production"}))));
