import fs from 'node:fs/promises';
import {build} from 'esbuild';
await fs.cp('public','dist/client',{recursive:true});
await build({entryPoints:['client/email.mjs'],bundle:true,platform:'browser',
  format:'esm',minify:true,target:'es2022',outfile:'dist/client/email-auth.js'});
