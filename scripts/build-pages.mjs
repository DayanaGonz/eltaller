import {renameSync,existsSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const endpoint=JSON.parse(readFileSync('data/form-connection.json','utf8')).endpoint;
if(endpoint&&!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint))throw new Error('Invalid Apps Script deployment URL');
const src='app/api', tmp='.api-build-backup';
if(existsSync(tmp)) throw new Error('Restore .api-build-backup before building');
renameSync(src,tmp);
try { const r=spawnSync(process.execPath,['node_modules/next/dist/bin/next','build','--webpack'],{stdio:'inherit',env:{...process.env,GITHUB_PAGES:'true',NEXT_PUBLIC_BASE_PATH:'/eltaller',NEXT_PUBLIC_SITE_URL:'https://dayanagonz.github.io/eltaller',NEXT_PUBLIC_FORM_ENDPOINT:endpoint,NEXT_PUBLIC_FORM_ENABLED:endpoint?'true':'false'}});process.exitCode=r.status??1; } finally {renameSync(tmp,src);}
