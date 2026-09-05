// Original vector lettering: game-specific shapes, with no font download.
import { writeFileSync } from 'node:fs';
const out=new URL('../src/public/hub/',import.meta.url);
const letters={
  W:'M0 0H20L23 65L34 44L45 65L48 0H68L64 100H46L34 78L22 100H4Z',
  O:'M10 0H58L68 10V90L58 100H10L0 90V10ZM22 22V78H46V22Z',
  R:'M0 0H57L68 11V52L55 65L70 100H46L30 68H22V100H0ZM22 21V47H46V21Z',
  L:'M0 0H23V78H68V100H0Z',
  D:'M0 0H52L68 16V84L52 100H0ZM23 22V78H40L46 72V28L40 22Z',
  M:'M0 100V0H20L34 31L48 0H68V100H47V39L34 66L21 39V100Z',
  T:'M0 0H68V23H45V100H23V23H0Z',
  A:'M0 100L19 0H49L68 100H46L42 78H26L22 100ZM30 56H38L34 28Z',
  C:'M12 0H68V23H24V77H68V100H12L0 88V12Z',
  I:'M0 0H30V100H0Z',
  S:'M12 0H68V23H24V39H56L68 51V88L56 100H0V77H44V60H12L0 48V12Z',
  K:'M0 0H22V38L43 0H69L41 49L70 100H43L22 61V100H0Z',
  E:'M0 0H68V22H23V39H59V60H23V78H68V100H0Z',
};
function word(text,y,width){
  const total=[...text].reduce((n,c)=>n+(c==='I'?30:68)+8,0)-8;
  let x=0;
  return `<g transform="translate(${(550-width)/2} ${y}) scale(${width/total} .9)">${[...text].map(c=>{const path=`<path transform="translate(${x})" d="${letters[c]}"/>`;x+=(c==='I'?30:68)+8;return path;}).join('')}</g>`;
}
function logo(name,first,second,widths,colors,slant){
  const shape=word(first,6,widths[0])+word(second,112,widths[1]);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 232"><defs><g id="lettering" fill-rule="evenodd">${shape}</g><linearGradient id="face" x2="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><g transform="translate(${slant?30:12} 4)${slant?' skewX(-7)':''}" stroke-linejoin="miter"><use href="#lettering" transform="translate(5 12)" fill="${colors[3]}" stroke="${colors[3]}" stroke-width="10"/><use href="#lettering" transform="translate(2 5)" fill="${colors[2]}" stroke="${colors[2]}" stroke-width="5"/><use href="#lettering" fill="url(#face)" stroke="${colors[3]}" stroke-width="2.2"/></g></svg>`;
  writeFileSync(new URL(`${name}-logo.svg`,out),svg+'\n');
}
logo('worldloom','WORLD','LOOM',[540,432],['#ffffe9','#c6d99c','#768752','#233125'],false);
logo('tacticstrike','TACTIC','STRIKE',[518,518],['#ffffff','#dce5e9','#64727b','#151d27'],true);
console.log('Built original Worldloom and TacticStrike vector wordmarks.');
