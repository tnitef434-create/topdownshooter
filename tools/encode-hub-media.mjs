// Encode directly from native frames; no intermediate lossy video pass.
import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const source=fileURLToPath(new URL('../../hub-capture-hq/',import.meta.url));
const output=fileURLToPath(new URL('../src/public/hub/',import.meta.url));
mkdirSync(output,{recursive:true});
const ffmpeg=process.env.FFMPEG_PATH || 'C:/pinokio/bin/ffmpeg-env/Library/bin/ffmpeg.exe';
function run(args){const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit',windowsHide:true});if(r.status!==0)throw new Error('Video encoding failed');}
const shots=['pond','coast','ridge','pond'];
for(const rendition of [{name:'worldloom-loop.mp4',width:1800,height:2000,crf:'18',maxrate:'9M'},{name:'worldloom-loop-mobile.mp4',width:900,height:1000,crf:'21',maxrate:'3M'}]){
  const inputs=shots.flatMap(scene=>['-framerate','30','-i',`${source}/${scene}/%04d.jpg`]);
  const prep=shots.map((_,i)=>`[${i}:v]scale=${rendition.width}:${rendition.height}:flags=lanczos,setsar=1,format=yuv420p[v${i}];`).join('');
  // The last crossfade meets the first shot at the same time/position on repeat.
  const fade='[v0][v1]xfade=transition=fade:duration=0.8:offset=5.2[a];[a][v2]xfade=transition=fade:duration=0.8:offset=10.4[b];[b][v3]xfade=transition=fade:duration=0.8:offset=15.6,trim=start=0.8:end=16.4,setpts=PTS-STARTPTS[v]';
  run([...inputs,'-filter_complex_threads','2','-filter_complex',prep+fade,'-map','[v]','-an','-r','30','-c:v','libx264','-threads','4','-preset','slow','-crf',rendition.crf,'-maxrate',rendition.maxrate,'-bufsize','18M','-pix_fmt','yuv420p','-movflags','+faststart',`${output}/${rendition.name}`]);
  const bytes=statSync(`${output}/${rendition.name}`).size;
  if(bytes>=25*1024*1024)throw new Error('Video exceeds the static hosting asset limit');
  console.log(`${rendition.name}: ${rendition.width}x${rendition.height}, 30fps, ${(bytes/1024/1024).toFixed(2)} MiB`);
}
run(['-i',`${source}/pond/0096.jpg`,'-q:v','3','-frames:v','1',`${output}/worldloom-poster.jpg`]);
