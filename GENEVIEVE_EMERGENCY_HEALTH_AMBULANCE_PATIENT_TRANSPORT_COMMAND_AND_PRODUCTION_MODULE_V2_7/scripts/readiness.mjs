import {getConfig} from "../src/config.mjs";
import {getStore} from "../src/store/index.mjs";
const config=getConfig(process.env);
const out={ready:config.ready,production:config.production,missing:config.missing,gates:config.gates};
if(config.production&&config.ready){
  try{ out.database=await (await getStore(config)).readiness(); }
  catch(error){ out.ready=false; out.database={ok:false,error:error.message}; }
}
console.log(JSON.stringify(out,null,2));
if(!out.ready) process.exitCode=1;
