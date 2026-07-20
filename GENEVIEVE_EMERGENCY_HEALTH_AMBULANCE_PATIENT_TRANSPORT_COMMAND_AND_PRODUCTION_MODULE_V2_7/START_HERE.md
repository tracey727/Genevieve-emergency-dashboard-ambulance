# START HERE — controlled configuration and testing

1. Keep `DEPLOYMENT_MODE=demo` and use fictional or coded data only.
2. Select the exact services: emergency call/dispatch, road ambulance, first response, interfacility transfer, RSQ/aeromedical, NEPT, mental-health transport, ED handover and fleet.
3. Map current QAS/provider protocols, Paramedicine Board requirements, hospital transfer procedures, privacy, WHS, medicines, driving, aviation, emergency and contract obligations.
4. Approve the role matrix and exact people who may triage, dispatch, assess, treat, administer medicines, choose destination, accept transfer, task assets, transport and close.
5. Configure call, scene risk, clinical deterioration, destination, handover, transfer, retrieval, NEPT, vehicle, equipment and outage procedures.
6. Test all interfaces with synthetic data, including CAD, telephony, mapping, QAS/provider records, hospitals, NEPT, RSQ, vehicles and official warning feeds.
7. Complete privacy, cybersecurity, location, backup, restoration, accessibility, emergency, insurance, fleet and governance review.
8. Record written production release approval before changing to production.

## Minimum fictional test scenarios

- emergency caller with uncertain location or blocked property access
- no available or accepting response resource
- personal threat, unsafe scene or multi-agency response
- patient deterioration during transport
- failed hospital pre-notification or delayed handover acceptance
- time-critical interfacility transfer without accepting clinician
- RSQ referral, weather diversion or asset contingency
- NEPT late pickup, cancellation, no-show or no return plan
- wheelchair, bariatric, oxygen, infection, supporter and communication needs
- dog, assistance-animal, pet or dependant responsibility before transport
- vehicle, oxygen, device, medicine, radio, CAD, navigation or power failure
- collision, staff injury, privacy event and complaint
- attempted closure without acceptance, action, outcome, evidence and governance sign-off
