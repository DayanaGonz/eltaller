import {renameSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const src='app/api', tmp='.api-build-backup';
if(existsSync(tmp)) throw new Error('Restore .api-build-backup before building');
renameSync(src,tmp);
try { const r=spawnSync(process.execPath,['node_modules/next/dist/bin/next','build','--webpack'],{stdio:'inherit',env:{...process.env,GITHUB_PAGES:'true',NEXT_PUBLIC_BASE_PATH:'/eltaller',NEXT_PUBLIC_SITE_URL:'https://dayanagonz.github.io/eltaller',NEXT_PUBLIC_FORM_ENABLED:'false'}});process.exitCode=r.status??1; } finally {renameSync(tmp,src);}
