import crypto from 'node:crypto';
import { nextStage, nextStageDueAt, validateNewCase, assertClosureAllowed } from '../accountability.mjs';

export class MemoryStore {
  constructor(){ this.cases=new Map(); this.events=[]; this.seed(); }
  seed(){
    const now=new Date(); const due=new Date(now.getTime()+45*60000).toISOString();
    this.createCase({tenantId:'tenant-demo-health',sectorId:'emergency-transport',title:'Emergency call has no accepted backup access pathway',summary:'Fictional dispatch continuity example. Resource notification is not an outcome; location, access, acceptance and follow-up remain open.',primaryOwnerId:'demo-dispatch_supervisor',backupOwnerId:'demo-service_manager',dueAt:due,createdBy:'demo-governance'});
    this.createCase({tenantId:'tenant-demo-health',sectorId:'emergency-transport',title:'Interfacility transfer has no documented receiving acceptance',summary:'Fictional transport example with sending, retrieval, transport and receiving handover accountability.',primaryOwnerId:'demo-sending_clinician',backupOwnerId:'demo-retrieval_coordinator',dueAt:due,createdBy:'demo-governance'});
  }
  async readiness(){ return {adapter:'memory-demo',persistent:false,appendOnlyEvents:true}; }
  async listCases(actor){ return [...this.cases.values()].filter(x=>x.tenant_id===actor.tenantId).sort((a,b)=>b.created_at.localeCompare(a.created_at)); }
  async getCase(actor,id){ const item=this.cases.get(id); if(!item||item.tenant_id!==actor.tenantId) return null; return item; }
  async createCase(input){ validateNewCase(input); const now=new Date().toISOString(); const id=crypto.randomUUID(); const item={id,tenant_id:input.tenantId,sector_id:input.sectorId,title:input.title,summary:input.summary,stage:'GREEN',status:'ASSIGNED',primary_owner_id:input.primaryOwnerId,backup_owner_id:input.backupOwnerId,due_at:input.dueAt,stage_due_at:input.dueAt,escalation_count:0,accepted_at:null,accepted_by:null,action_summary:null,outcome_summary:null,residual_risk:null,governance_signoff_by:null,governance_signoff_at:null,closed_at:null,created_at:now,updated_at:now}; this.cases.set(id,item); this.event(item,input.createdBy,'CASE_CREATED',{primaryOwnerId:item.primary_owner_id,backupOwnerId:item.backup_owner_id,dueAt:item.due_at}); return item; }
  async accept(actor,id){ const item=await this.getCase(actor,id); if(!item) return null; if(actor.id!==item.primary_owner_id && actor.id!==item.backup_owner_id && !actor.permissions.includes('accept_assignment')) throw forbidden('Only an assigned or authorised owner may accept.'); item.accepted_at=new Date().toISOString(); item.accepted_by=actor.id; item.status='ACCEPTED'; item.updated_at=item.accepted_at; this.event(item,actor.id,'ASSIGNMENT_ACCEPTED',{}); return item; }
  async recordAction(actor,id,input){ const item=await this.getCase(actor,id); if(!item) return null; item.action_summary=String(input.actionSummary||'').trim(); if(!item.action_summary) throw bad('actionSummary is required.'); item.outcome_summary=String(input.outcomeSummary||'').trim()||null; item.residual_risk=String(input.residualRisk||'').trim()||null; item.status='ACTIONED'; item.updated_at=new Date().toISOString(); this.event(item,actor.id,'ACTION_RECORDED',{actionSummary:item.action_summary,outcomeSummary:item.outcome_summary,residualRisk:item.residual_risk}); return item; }
  async escalate(actor,id,input={}){ const item=await this.getCase(actor,id); if(!item) return null; const from=item.stage; item.stage=nextStage(from); item.stage_due_at=nextStageDueAt(item.stage); item.escalation_count+=1; item.status=item.stage==='GOVERNANCE'?'UNDER_REVIEW':item.status; item.updated_at=new Date().toISOString(); this.event(item,actor.id,'CASE_ESCALATED',{from,to:item.stage,reason:String(input.reason||'Timed or manual escalation')}); return item; }
  async close(actor,id,input){ const item=await this.getCase(actor,id); if(!item) return null; assertClosureAllowed(item,input,actor); item.action_summary=String(input.actionSummary||item.action_summary); item.outcome_summary=String(input.outcomeSummary||item.outcome_summary); item.residual_risk=String(input.residualRisk||item.residual_risk); item.governance_signoff_by=actor.id; item.governance_signoff_at=new Date().toISOString(); item.closed_at=item.governance_signoff_at; item.status='CLOSED'; item.updated_at=item.closed_at; this.event(item,actor.id,'CASE_CLOSED',{outcomeSummary:item.outcome_summary,evidenceReference:input.evidenceReference,residualRisk:item.residual_risk}); return item; }

  async escalateOverdueSystem(now=new Date()){
    const escalated=[];
    for(const item of this.cases.values()){
      if(item.status==='CLOSED'||!item.stage_due_at||Date.parse(item.stage_due_at)>now.getTime()) continue;
      const from=item.stage; item.stage=nextStage(from); item.stage_due_at=nextStageDueAt(item.stage,now); item.escalation_count+=1;
      if(item.stage==='GOVERNANCE') item.status='UNDER_REVIEW'; item.updated_at=now.toISOString();
      this.event(item,'system-escalation-worker','TIMED_ESCALATION',{from,to:item.stage,overdueAt:item.stage_due_at}); escalated.push(item.id);
    }
    return {count:escalated.length,caseIds:escalated,checkedAt:now.toISOString()};
  }
  async history(actor,id){ const item=await this.getCase(actor,id); if(!item) return null; return this.events.filter(e=>e.case_id===id); }
  event(item,actorId,type,detail){ this.events.push({id:crypto.randomUUID(),tenant_id:item.tenant_id,case_id:item.id,event_type:type,actor_id:actorId||'system',detail,occurred_at:new Date().toISOString()}); }
}
function forbidden(m){const e=new Error(m);e.status=403;return e} function bad(m){const e=new Error(m);e.status=400;return e}
