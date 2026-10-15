import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import pg from "pg";
const {Pool}=pg;
const url=process.env.DATABASE_URL;
if(!url) throw new Error("DATABASE_URL is required");
const here=path.dirname(fileURLToPath(import.meta.url));
const sql=await fs.readFile(path.join(here,"../database/migrations/001_core.sql"),"utf8");
const pool=new Pool({connectionString:url,ssl:process.env.DATABASE_SSL==="false"?false:{rejectUnauthorized:false}});
try{ await pool.query(sql); console.log("Migration 001_core.sql applied."); }
finally{ await pool.end(); }
