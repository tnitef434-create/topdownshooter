import {spawnSync} from 'node:child_process';
import {statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const input=fileURLToPath(new URL('../../bot-match-capture/',import.meta.url))+'%04d.jpg';
const output=fileURLToPath(new URL('../src/public/hub/',import.meta.url));
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
function run(args){const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit',windowsHide:true});if(result.status!==0)throw new Error('Bot film encoding failed.');}
for(const {name,width,height,crf} of [{name:'tacticstrike-loop.mp4',width:1800,height:2000,crf:19},{name:'tacticstrike-loop-mobile.mp4',width:900,height:1000,crf:22}]){
  const prep=`[0:v]scale=${width}:${height}:flags=lanczos,format=yuv420p[a];[1:v]scale=${width}:${height}:flags=lanczos,format=yuv420p[b];[a][b]xfade=transition=fade:duration=0.8:offset=19.2,trim=start=0.8:end=20,setpts=PTS-STARTPTS[v]`;
  run(['-framerate','30','-i',input,'-framerate','30','-i',input,'-filter_complex_threads','2','-filter_complex',prep,'-map','[v]','-an','-r','30','-c:v','libx264','-threads','4','-preset','slow','-crf',String(crf),'-pix_fmt','yuv420p','-movflags','+faststart',output+name]);
  const size=statSync(output+name).size;if(size>25*1024*1024)throw new Error('Clip exceeds the hosting asset limit.');
  console.log(`${name}: ${width}x${height}, 30fps, ${(size/1024/1024).toFixed(2)} MiB`);
}
run(['-i',input.replace('%04d','0240'),'-vf','scale=900:1000','-q:v','2','-frames:v','1',output+'tacticstrike-poster.jpg']);
