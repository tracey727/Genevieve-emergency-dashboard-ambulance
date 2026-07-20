import crypto from 'node:crypto';
import { permissionsFor } from './rbac.mjs';

const b64url = value => Buffer.from(value).toString('base64url');
const timingSafeEqualText = (a,b) => {
  const aa=Buffer.from(a); const bb=Buffer.from(b);
  return aa.length===bb.length && crypto.timingSafeEqual(aa,bb);
};

export function signDemoToken(claims, secret) {
  const header=b64url(JSON.stringify({alg:'HS256',typ:'JWT'}));
  const body=b64url(JSON.stringify(claims));
  const sig=crypto.createHmac('sha256',secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token, config, nowSeconds=Math.floor(Date.now()/1000)) {
  const parts=String(token||'').split('.');
  if (parts.length!==3) throw authError('Invalid access token.');
  const [header64,payload64,sig]=parts;
  let header,payload;
  try { header=JSON.parse(Buffer.from(header64,'base64url')); payload=JSON.parse(Buffer.from(payload64,'base64url')); }
  catch { throw authError('Invalid access token.'); }
  if (header.alg!=='HS256') throw authError('Unsupported token algorithm.');
  const expected=crypto.createHmac('sha256',config.jwtSecret).update(`${header64}.${payload64}`).digest('base64url');
  if (!timingSafeEqualText(sig,expected)) throw authError('Invalid access token signature.');
  if (payload.exp && Number(payload.exp)<nowSeconds) throw authError('Access token expired.');
  if (payload.nbf && Number(payload.nbf)>nowSeconds) throw authError('Access token not active.');
  if (config.jwtIssuer && payload.iss!==config.jwtIssuer) throw authError('Invalid token issuer.');
  const aud=Array.isArray(payload.aud)?payload.aud:[payload.aud];
  if (config.jwtAudience && !aud.includes(config.jwtAudience)) throw authError('Invalid token audience.');
  if (!payload.sub || !payload.tenant_id || !payload.role) throw authError('Token missing required identity claims.');
  return { id:String(payload.sub), tenantId:String(payload.tenant_id), displayName:String(payload.name||payload.sub), role:String(payload.role), permissions:permissionsFor(String(payload.role)), demo:false };
}

export function actorFromRequest(request, config) {
  if (!config.production) {
    const role=request.headers.get('x-genevieve-demo-role') || 'governance';
    return {id:`demo-${role}`,tenantId:config.defaultTenantId,displayName:`Fictional ${role}`,role,permissions:permissionsFor(role),demo:true};
  }
  const auth=request.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return verifyToken(auth.slice(7),config);
  if (config.trustedProxyAuth) {
    const id=request.headers.get('x-auth-user-id'); const tenantId=request.headers.get('x-auth-tenant-id'); const role=request.headers.get('x-auth-role');
    if (id&&tenantId&&role) return {id,tenantId,displayName:request.headers.get('x-auth-user-name')||id,role,permissions:permissionsFor(role),demo:false};
  }
  throw authError('Authentication required.');
}
function authError(message){ const e=new Error(message); e.status=401; return e; }
