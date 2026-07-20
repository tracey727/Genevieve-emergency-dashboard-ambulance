import fs from 'node:fs/promises';
import path from 'node:path';
import {actorFromRequest} from './auth.mjs';
import {requirePermission} from './rbac.mjs';
import {getStore} from './store/index.mjs';
import {json,bodyJson,errorResponse,securityHeaders} from './http.mjs';
import {emergencyTransportConfig,emergencyTransportDashboard,emergencyTransportPeople,emergencyTransportPerson,emergencyTransportQueue,emergencyTransportSafetyEvents,emergencyTransportEmergencies} from './emergency-transport.mjs';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');let sectorsCache;
async function sectors(){sectorsCache ||= JSON.parse(await fs.readFile(path.join(root,'config/sectors.json'),'utf8'));return sectorsCache;}
export async function handleApi(request,config){try{
 const url=new URL(request.url),p=url.pathname;
 if(p==='/api/health')return securityHeaders(json({ok:true,product:'GENEVIEVE Emergency Health, Ambulance & Patient Transport™ Command and Production Module V2.7',mode:config.mode,time:new Date().toISOString()}));
 if(p==='/api/readiness'){const store=await getStore(config),db=await store.readiness();return securityHeaders(json({ready:config.ready,production:config.production,mode:config.mode,missing:config.missing,gates:config.gates,database:db,separation:{genevieveListens:'separate app, repository, storage namespace and deployment'},warning:config.production?'Production release gates are enforced.':'Fictional demonstration data only.'}));}
 if(p==='/api/system/escalation-sweep'&&(request.method==='GET'||request.method==='POST')){if(config.production&&request.headers.get('authorization')!==`Bearer ${config.cronSecret}`){const e=new Error('Cron authentication required.');e.status=401;throw e;}const store=await getStore(config);return securityHeaders(json(await store.escalateOverdueSystem(new Date())));}
 const actor=actorFromRequest(request,config),store=await getStore(config);
 if(p==='/api/emergency-transport/config'&&request.method==='GET')return securityHeaders(json(await emergencyTransportConfig()));
 if(p==='/api/emergency-transport/dashboard'&&request.method==='GET')return securityHeaders(json(emergencyTransportDashboard()));
 if(p==='/api/emergency-transport/people'&&request.method==='GET')return securityHeaders(json({results:emergencyTransportPeople()}));
 if(p.startsWith('/api/emergency-transport/people/')&&request.method==='GET'){const id=decodeURIComponent(p.split('/').pop()),item=emergencyTransportPerson(id);return securityHeaders(item?json(item):json({error:'Not found'},404));}
 if(p==='/api/emergency-transport/queue'&&request.method==='GET')return securityHeaders(json({results:emergencyTransportQueue()}));
 if(p==='/api/emergency-transport/safety-events'&&request.method==='GET')return securityHeaders(json({results:emergencyTransportSafetyEvents()}));
 if(p==='/api/emergency-transport/emergencies'&&request.method==='GET')return securityHeaders(json({results:emergencyTransportEmergencies()}));
 if(p==='/api/sectors'&&request.method==='GET')return securityHeaders(json(await sectors()));
 if(p==='/api/cases'&&request.method==='GET')return securityHeaders(json({results:await store.listCases(actor)}));
 if(p==='/api/cases'&&request.method==='POST'){requirePermission(actor,'assign_case');const b=await bodyJson(request),item=await store.createCase({tenantId:actor.tenantId,createdBy:actor.id,...b});return securityHeaders(json(item,201));}
 const m=p.match(/^\/api\/cases\/([^/]+)(?:\/(accept|action|escalate|close|history))?$/);
 if(m){const id=decodeURIComponent(m[1]),action=m[2];if(!action&&request.method==='GET'){const item=await store.getCase(actor,id);return securityHeaders(item?json(item):json({error:'Not found'},404));}if(action==='history'&&request.method==='GET'){requirePermission(actor,'read_audit');const history=await store.history(actor,id);return securityHeaders(history?json({results:history}):json({error:'Not found'},404));}if(action==='accept'&&request.method==='POST'){requirePermission(actor,'accept_assignment');const item=await store.accept(actor,id);return securityHeaders(item?json(item):json({error:'Not found'},404));}if(action==='action'&&request.method==='POST'){requirePermission(actor,'record_action');const item=await store.recordAction(actor,id,await bodyJson(request));return securityHeaders(item?json(item):json({error:'Not found'},404));}if(action==='escalate'&&request.method==='POST'){requirePermission(actor,'escalate_case');const item=await store.escalate(actor,id,await bodyJson(request));return securityHeaders(item?json(item):json({error:'Not found'},404));}if(action==='close'&&request.method==='POST'){requirePermission(actor,'governance_signoff');const item=await store.close(actor,id,await bodyJson(request));return securityHeaders(item?json(item):json({error:'Not found'},404));}}
 return securityHeaders(json({error:'Not found'},404));
}catch(error){console.error(error);return securityHeaders(errorResponse(error));}}
