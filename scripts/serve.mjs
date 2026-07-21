import {createServer} from 'node:http';import {readFile,stat} from 'node:fs/promises';import {extname,join} from 'node:path';
const root=join(process.cwd(),'dist');try{await stat(root)}catch{await import('./build.mjs')}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webmanifest':'application/manifest+json'};
createServer(async(req,res)=>{try{let path=join(root,decodeURIComponent((req.url||'/').split('?')[0]));if(!extname(path))path=join(root,'index.html');const body=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(body)}catch{res.writeHead(404);res.end('Not found')}}).listen(4173,()=>console.log('SysAdmin Lab: http://localhost:4173'));
