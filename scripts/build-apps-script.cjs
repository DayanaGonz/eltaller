const fs=require('node:fs');const ts=require('typescript');
const compiled=ts.transpileModule(fs.readFileSync('lib/form.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText.replace('new URL(value)','parseHttpUrl_(value)');
fs.writeFileSync('backend/google-apps-script/Code.gs','// Generado desde lib/form.ts. Ejecutar setup una vez antes de implementar.\nconst TallerForm=(function(){const exports={};\n'+compiled+'\nreturn exports;})();\n'+fs.readFileSync('backend/google-apps-script/receiver.js','utf8'));
