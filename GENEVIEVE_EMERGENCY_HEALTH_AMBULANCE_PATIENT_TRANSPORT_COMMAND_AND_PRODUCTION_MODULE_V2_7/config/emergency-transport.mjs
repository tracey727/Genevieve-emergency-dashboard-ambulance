export const emergencyTransportConfigData = Object.freeze({
  version:"2.7.1-reconciled",
  person_profile_required_fields:["identity status","communication needs","support network","allergies","medicines context","baseline","change signs","goals","transport needs","safe contact","dependant or pet responsibility"],
  call_intake_dispatch:{controls:["location and caller verification","authorised triage reference","named dispatch owner and backup","resource acceptance","elapsed-time visibility","manual fallback"],boundary:"GENEVIEVE records ownership, timing and evidence. Authorised emergency services retain triage and dispatch authority."},
  scene_crew_safety:{controls:["scene hazard","access constraint","crew acknowledgement","police/fire support request","withdrawal/welfare follow-up"],boundary:"No software-directed scene entry. Authorised crews and agencies retain operational authority."},
  prehospital_clinical_care:{controls:["current protocol reference","authorised clinician","observations","treatment evidence","deterioration escalation"],boundary:"No autonomous diagnosis, treatment, medicines or clinical risk verdict."},
  destination_prenotification:{controls:["destination capability","human confirmer","pre-notification","acceptance reference","diversion contingency"],boundary:"Destination remains an authorised human clinical/operational decision."},
  hospital_handover_transfer_of_care:{controls:["arrival","handover pending/delayed/accepted","receiving person","delay reason","evidence reference"],boundary:"Arrival is not transfer of responsibility. Closure requires accepted human handover evidence."},
  interfacility_transfer:{controls:["sending acceptance","receiving acceptance","transport capability","escort/equipment","handover"],boundary:"GENEVIEVE coordinates evidence only; sending, retrieval and receiving clinicians retain authority."},
  retrieval_aeromedical:{controls:["referral","asset availability","crew","weather/diversion","receiving acceptance"],boundary:"RSQ and authorised retrieval/aviation teams retain tasking, flight and clinical authority."},
  non_emergency_patient_transport:{controls:["booking owner","pickup","support needs","journey","arrival","return plan","safe entry"],boundary:"A booking is not a completed transport outcome."},
  vehicles_equipment_medicines:{controls:["vehicle readiness","oxygen","medicines","equipment","communications","cleaning"],boundary:"Readiness evidence supports human review and cannot autonomously release or dispatch a vehicle."},
  workforce_governance:{controls:["registration","role","scope","driver authority","fatigue","supervision"],boundary:"No assignment outside approved role, scope, licence or fitness."},
  incidents_complaints_quality:{controls:["incident chronology","delay reason","harm/privacy event","corrective action","verification"],boundary:"Incidents and delays remain visible until reviewed and evidenced."},
  emergency_rules:["Queensland facility code is separate from GENEVIEVE stage","Australian Warning System authority remains external","No autonomous emergency command","Every unresolved matter keeps a named owner and backup"],
  emergency_transport_standards:["Queensland Ambulance Service current authorised protocols","Paramedicine Board/Ahpra requirements where applicable","Queensland Health transfer and handover requirements where applicable","Privacy and cybersecurity obligations","WHS and fatigue controls","Medicines and controlled-drug governance","Road, aviation and emergency-management authority"],
  sources_checked:[
    {authority:"Queensland Ambulance Service",resource:"Clinical practice and operational protocols",checked:"REQUIRES CURRENT SERVICE MAPPING BEFORE PRODUCTION"},
    {authority:"Queensland Health",resource:"Hospital transfer/handover procedures",checked:"REQUIRES CURRENT SERVICE MAPPING BEFORE PRODUCTION"},
    {authority:"Paramedicine Board of Australia / Ahpra",resource:"Registration and professional requirements",checked:"REQUIRES CURRENT SERVICE MAPPING BEFORE PRODUCTION"}
  ],
  release_gates:["privacy review","clinical governance approval","cybersecurity review","incident response","backup/restore test","data location approval","role matrix approval","emergency procedures approval","insurance review","accessibility test","synthetic interface verification","written production release"],
  non_autonomous_boundaries:["no autonomous triage","no autonomous dispatch","no autonomous treatment or medicines","no autonomous destination","no autonomous scene entry","no automatic clinical closure","no cross-tenant record access"]
});
export function emergencyTransportConfig(){ return structuredClone(emergencyTransportConfigData); }
