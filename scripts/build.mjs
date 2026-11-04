import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {build} from 'esbuild';
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.svg':'image/svg+xml','.webp':'image/webp','.woff':'font/woff','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8'};
const assets = {};
function collect(directory) {
  for (const name of fs.readdirSync(directory).sort()) {
    if (name.startsWith('.')) continue;
    const file = path.join(directory,name);
    if (fs.statSync(file).isDirectory()) collect(file);
    else assets['/'+path.relative('public',file)] = [mime[path.extname(file)] || 'application/octet-stream',fs.readFileSync(file).toString('base64')];
  }
}
collect('public');
const bundle = await build({entryPoints:['client/email.mjs'],bundle:true,platform:'browser',format:'esm',
  write:false,minify:true,target:'es2022'});
assets['/email-auth.js'] = [mime['.js'],Buffer.from(bundle.outputFiles[0].contents).toString('base64')];
const chapters = [1,2,3,4].flatMap(n=>vm.runInNewContext(fs.readFileSync('public/commentary-'+n+'.js','utf8')+';commentary'+n));
const counts = chapters.map(parts=>parts.length);
fs.mkdirSync('dist/server',{recursive:true});
fs.writeFileSync('dist/server/index.js','const partCounts='+JSON.stringify(counts)+';\nconst assets='+JSON.stringify(assets)+';\n'+fs.readFileSync('worker/index.mjs','utf8'));
