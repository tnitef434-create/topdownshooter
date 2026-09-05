import { spawnSync } from 'node:child_process';
import { mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const source=fileURLToPath(new URL('../../hub-capture/',import.meta.url));
const output=fileURLToPath(new URL('../src/public/hub/',import.meta.url));
mkdirSync(output,{recursive:true});
const ffmpeg=process.env.FFMPEG_PATH || 'C:/pinokio/bin/ffmpeg-env/Library/bin/ffmpeg.exe';
function run(args){const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit',windowsHide:true});if(result.status!==0)throw new Error('Video encoding failed');}
for(const scene of ['pond','coast','ridge'])run(['-framerate','24','-i',`${source}/${scene}/%04d.jpg`,'-vf','scale=768:854:flags=lanczos,setsar=1','-an','-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p',`${source}/${scene}.mp4`]);
// Join three gameplay shots and crossfade back into the first shot. Trimming
// the first 0.8s closes the loop at the same shot/time with no black frame.
run(['-i',`${source}/pond.mp4`,'-i',`${source}/coast.mp4`,'-i',`${source}/ridge.mp4`,'-i',`${source}/pond.mp4`,
  '-filter_complex','[0:v][1:v]xfade=transition=fade:duration=0.8:offset=5.2[a];[a][2:v]xfade=transition=fade:duration=0.8:offset=10.4[b];[b][3:v]xfade=transition=fade:duration=0.8:offset=15.6,trim=start=0.8:end=16.4,setpts=PTS-STARTPTS[v]',
  '-map','[v]','-an','-r','24','-c:v','libx264','-preset','slow','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',`${output}/worldloom-loop.mp4`]);
copyFileSync(`${source}/pond/0096.jpg`,`${output}/worldloom-poster.jpg`);
run(['-i',`${source}/tacticstrike.jpg`,'-vf','crop=1120:1400:340:80,scale=900:1124:flags=lanczos','-q:v','3','-frames:v','1',`${output}/tacticstrike-poster.jpg`]);
console.log('Encoded real game scenes in src/public/hub.');
