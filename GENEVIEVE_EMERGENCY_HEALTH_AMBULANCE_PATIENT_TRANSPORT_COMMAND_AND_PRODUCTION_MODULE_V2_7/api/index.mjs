import {getConfig,assertProductionSafe} from '../src/config.mjs';
import {handleApi} from '../src/router.mjs';
const config=getConfig(); assertProductionSafe(config);
export default { async fetch(request){
  const url=new URL(request.url); const rewritten=url.searchParams.get('__path');
  if(rewritten){url.pathname=rewritten;url.searchParams.delete('__path');request=new Request(url,request);}
  return handleApi(request,config);
}};
