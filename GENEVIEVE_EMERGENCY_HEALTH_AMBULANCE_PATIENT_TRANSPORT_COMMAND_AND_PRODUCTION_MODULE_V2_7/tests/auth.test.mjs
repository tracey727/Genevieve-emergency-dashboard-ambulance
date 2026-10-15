import test from "node:test";
import assert from "node:assert/strict";
import {signDemoToken,verifyToken,actorFromRequest} from "../src/auth.mjs";
const config={jwtSecret:"12345678901234567890123456789012",jwtIssuer:"issuer",jwtAudience:"aud",production:true,trustedProxyAuth:false};
function claims(extra={}){return {sub:"u1",tenant_id:"t1",role:"governance",iss:"issuer",aud:"aud",exp:4102444800,...extra};}
test("signed token verifies",()=>assert.equal(verifyToken(signDemoToken(claims(),config.jwtSecret),config).tenantId,"t1"));
test("bad signature rejected",()=>assert.throws(()=>verifyToken(signDemoToken(claims(),config.jwtSecret)+"x",config)));
test("wrong issuer rejected",()=>assert.throws(()=>verifyToken(signDemoToken(claims({iss:"wrong"}),config.jwtSecret),config)));
test("wrong audience rejected",()=>assert.throws(()=>verifyToken(signDemoToken(claims({aud:"wrong"}),config.jwtSecret),config)));
test("demo request gets fictional actor",()=>{const a=actorFromRequest(new Request("https://x"),{production:false,defaultTenantId:"tenant-demo-health"});assert.equal(a.demo,true);});
