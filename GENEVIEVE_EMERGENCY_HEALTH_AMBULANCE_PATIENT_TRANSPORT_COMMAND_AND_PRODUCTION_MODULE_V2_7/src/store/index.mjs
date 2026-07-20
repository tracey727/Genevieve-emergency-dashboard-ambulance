import { MemoryStore } from './memory.mjs';
import { PostgresStore } from './postgres.mjs';
let singleton;
export async function getStore(config){
  if(singleton) return singleton;
  if(config.production){ if(!config.databaseUrl) throw new Error('Production requires DATABASE_URL.'); singleton=await PostgresStore.create(config); }
  else singleton=new MemoryStore();
  return singleton;
}
export function resetStoreForTests(){ singleton=undefined; }
