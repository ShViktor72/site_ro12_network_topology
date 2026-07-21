import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
const out=new URL('../dist/',import.meta.url);await rm(out,{recursive:true,force:true});await mkdir(new URL('assets/',out),{recursive:true});
let html=await readFile(new URL('../index.html',import.meta.url),'utf8');html=html.replace('./src/app.ts','./assets/app.js');await writeFile(new URL('index.html',out),html);
for(const name of ['app.ts','config.ts','storage.ts','architecturePages.ts','networkArchitecture.ts']){let source=await readFile(new URL(`../src/${name}`,import.meta.url),'utf8');source=stripTypeScriptTypes(source,{mode:'strip'}).replaceAll("'./config'","'./config.js'").replaceAll("'./storage'","'./storage.js'").replaceAll("'./architecturePages'","'./architecturePages.js'").replaceAll("'./networkArchitecture'","'./networkArchitecture.js'").replace("import './style.css';",'');await writeFile(new URL(`assets/${name.replace('.ts','.js')}`,out),source)}
await cp(new URL('../src/style.css',import.meta.url),new URL('assets/style.css',out));await cp(new URL('../public/manifest.webmanifest',import.meta.url),new URL('manifest.webmanifest',out));await writeFile(new URL('.nojekyll',out),'');
console.log('Production build created in dist/');
