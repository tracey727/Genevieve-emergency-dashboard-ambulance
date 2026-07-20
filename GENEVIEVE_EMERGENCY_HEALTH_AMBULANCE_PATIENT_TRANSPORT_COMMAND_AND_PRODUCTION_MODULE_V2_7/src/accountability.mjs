export const STAGES = Object.freeze(['GREEN','AMBER','RED','CRITICAL','GOVERNANCE']);
export const NEXT_STAGE = Object.freeze({GREEN:'AMBER',AMBER:'RED',RED:'CRITICAL',CRITICAL:'GOVERNANCE',GOVERNANCE:'GOVERNANCE'});
export const STAGE_MINUTES = Object.freeze({GREEN:240,AMBER:60,RED:15,CRITICAL:5,GOVERNANCE:0});
export const ACTIVE_STATUSES = Object.freeze(['OPEN','ASSIGNED','ACCEPTED','ACTIONED','UNDER_REVIEW']);

export function nextStage(stage){ if(!STAGES.includes(stage)) throw validation('Invalid stage.'); return NEXT_STAGE[stage]; }
export function nextStageDueAt(stage,fromDate=new Date()){ const minutes=STAGE_MINUTES[stage] ?? 0; return stage==='GOVERNANCE'?null:new Date(fromDate.getTime()+minutes*60000).toISOString(); }
export function canTransition(from,to){ return from===to || NEXT_STAGE[from]===to; }
export function validateNewCase(input){
  const required=['sectorId','title','summary','primaryOwnerId','backupOwnerId','dueAt'];
  const missing=required.filter(k=>!String(input?.[k]||'').trim());
  if(missing.length) throw validation(`Missing: ${missing.join(', ')}`);
  if(input.primaryOwnerId===input.backupOwnerId) throw validation('Primary and backup owners must be different.');
  if(Number.isNaN(Date.parse(input.dueAt))) throw validation('dueAt must be an ISO date/time.');
}
export function closureGaps(record,input,actor){
  const gaps=[];
  if(!record.accepted_at) gaps.push('owner acceptance');
  if(!String(input.actionSummary||record.action_summary||'').trim()) gaps.push('action summary');
  if(!String(input.outcomeSummary||record.outcome_summary||'').trim()) gaps.push('outcome summary');
  if(!String(input.evidenceReference||'').trim()) gaps.push('evidence reference');
  if(!String(input.residualRisk||record.residual_risk||'').trim()) gaps.push('residual-risk assessment');
  if(actor?.role!=='governance') gaps.push('governance authorisation');
  return gaps;
}
export function assertClosureAllowed(record,input,actor){ const gaps=closureGaps(record,input,actor); if(gaps.length) throw validation(`Closure blocked: ${gaps.join(', ')}`); }
export function validation(message){ const e=new Error(message); e.status=400; return e; }
