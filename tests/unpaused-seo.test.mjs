import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const origin='https://unpaused.online';
const pages=[
  ['/', 'src/index.html'],
  ['/aurora/', 'src/public/aurora/index.html'],
  ['/worldloom/', 'src/public/worldloom/index.html'],
  ['/tacticstrike/', 'src/tacticstrike/index.html'],
  ['/games/aurora/', 'src/public/games/aurora/index.html'],
  ['/games/worldloom/', 'src/public/games/worldloom/index.html'],
  ['/games/tacticstrike/', 'src/public/games/tacticstrike/index.html'],
  ['/hexgl/', 'src/public/hexgl/index.html'],
  ['/2048/', 'src/public/2048/index.html'],
  ['/hextris/', 'src/public/hextris/index.html'],
  ['/privacy/', 'src/public/privacy/index.html'],
];
const unescape=s=>s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
function attributes(tag){return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1],unescape(m[2])]))}
function inspect(file){
  const html=readFileSync(file,'utf8'),head=html.split('</head>')[0];
  const metas=[...head.matchAll(/<meta\b[^>]*>/gi)].map(m=>attributes(m[0]));
  const links=[...head.matchAll(/<link\b[^>]*>/gi)].map(m=>attributes(m[0]));
  const scripts=[...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>attributes(m[1]).type==='application/ld+json');
  return {html,head,metas,links,title:unescape(head.match(/<title>(.*?)<\/title>/si)?.[1]||''),schema:scripts.map(m=>JSON.parse(m[2]))};
}
const asset=path=>resolve('src/public','.'+path);

test('every public route has a unique descriptive title and a clean self-canonical before JavaScript',()=>{
  const titles=new Set(),descriptions=new Set();
  for(const [route,file]of pages){
    const page=inspect(file),canonical=page.links.filter(l=>l.rel==='canonical'),description=page.metas.filter(m=>m.name==='description');
    assert.deepEqual(canonical.map(l=>l.href),[origin+route],file);
    assert.equal(description.length,1,file);assert.ok(description[0].content.length>=60,file);
    assert.ok(page.title.includes('Unpaused')&&page.title.length<=75,file);
    titles.add(page.title);descriptions.add(description[0].content);
    assert.equal(page.metas.find(m=>m.property==='og:url')?.content,origin+route,file);
    assert.equal(page.metas.find(m=>m.name==='twitter:card')?.content,'summary_large_image',file);
    assert.equal(page.metas.some(m=>m.name==='robots'&&/noindex|nofollow/i.test(m.content)),false,file);
    assert.ok(page.schema.length>0,file);
    for(const data of page.schema)assert.equal(data['@context'],'https://schema.org');
  }
  assert.equal(titles.size,pages.length);assert.equal(descriptions.size,pages.length);
});

test('social cards use deployable public images, accurate dimensions and meaningful alternative text',()=>{
  for(const [,file]of pages){
    const page=inspect(file),value=key=>page.metas.find(m=>m.property===key)?.content;
    const image=new URL(value('og:image'));
    assert.equal(image.origin,origin);assert.ok(existsSync(asset(image.pathname)),file);
    assert.ok(value('og:image:alt')?.length>8,file);
    const bytes=readFileSync(asset(image.pathname));
    if(image.pathname.endsWith('.png')){
      assert.equal(Number(value('og:image:width')),bytes.readUInt32BE(16),file);
      assert.equal(Number(value('og:image:height')),bytes.readUInt32BE(20),file);
    }
  }
});

test('sitemap covers all and only public canonical pages while robots leaves runtime assets crawlable',()=>{
  const xml=readFileSync('src/public/sitemap.xml','utf8');
  assert.match(xml,/xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
  assert.deepEqual(urls.sort(),pages.map(([route])=>origin+route).sort());
  for(const url of urls){const u=new URL(url);assert.equal(u.search,'');assert.equal(u.hash,'');}
  const robots=readFileSync('src/public/robots.txt','utf8');
  assert.match(robots,/Sitemap: https:\/\/unpaused.online\/sitemap.xml/);
  assert.match(robots,/User-agent: \*\s+Allow: \//);
  assert.doesNotMatch(robots,/^Disallow:\s*\/(?:\s*$|assets|worldloom|account)/mi);
});

test('game structured data identifies the actual games without invented reviews or activity',()=>{
  for(const [route,file]of pages.filter(([route])=>['/worldloom/','/tacticstrike/'].includes(route))){
    const graph=inspect(file).schema.flatMap(schema=>schema['@graph']||[schema]);
    const game=graph.find(node=>node['@type']==='VideoGame');
    assert.ok(game,file);assert.equal(game.url,origin+route);assert.equal(game['@id'],origin+route+'#game');
    assert.equal(game.gamePlatform,'Web browser');assert.equal(game.isAccessibleForFree,true);
    for(const field of ['aggregateRating','review','interactionStatistic','award'])assert.equal(Object.hasOwn(game,field),false);
    assert.equal(game.potentialAction.target,origin+route);
    assert.equal(game.publisher['@id'],origin+'/#organization');
    assert.match(inspect(file).html,/<noscript>[\s\S]*?<main class="no-script-game">[\s\S]*?game guide[\s\S]*?<\/noscript>/);
  }
});

test('missing pages remain genuine 404s and immutable caching only covers fingerprinted bundles',()=>{
  assert.match(readFileSync('wrangler.toml','utf8'),/not_found_handling\s*=\s*"404-page"/);
  assert.equal(inspect('src/public/404.html').metas.find(m=>m.name==='robots')?.content,'noindex, follow');
  const headers=readFileSync('src/public/_headers','utf8');
  assert.match(headers,/\/assets\/\*\s+Cache-Control: public, max-age=31536000, immutable/);
  assert.doesNotMatch(headers,/^\/\*\s+Cache-Control:[^\n]*immutable/m);
  assert.doesNotMatch(headers,/Content-Security-Policy|Cross-Origin-Opener-Policy/,'SEO deployment does not change account popup policies');
});
