import {getConfig,assertProductionSafe} from "../src/config.mjs";
import {handleApi} from "../src/router.mjs";
import {getStore} from "../src/store/index.mjs";

function withRuntimeEnv(env){
  return {...env, DEPLOYMENT_MODE:env.DEPLOYMENT_MODE||"demo", PUBLIC_BASE_URL:env.PUBLIC_BASE_URL||"https://genevieve-ambulance-v2-7.workers.dev"};
}

export default {
  async fetch(request,env){
    const runtime=withRuntimeEnv(env);
    const config=getConfig(runtime);
    assertProductionSafe(config);
    const url=new URL(request.url);
    if(url.pathname.startsWith("/api/")) return handleApi(request,config);
    if(env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Static asset binding unavailable.",{status:503});
  },
  async scheduled(_controller,env,ctx){
    const runtime=withRuntimeEnv(env);
    const config=getConfig(runtime);
    assertProductionSafe(config);
    ctx.waitUntil((async()=>{
      const store=await getStore(config);
      await store.escalateOverdueSystem(new Date());
    })());
  }
};
