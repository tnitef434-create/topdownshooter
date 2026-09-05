import {spawnSync} from 'node:child_process';
import {mkdirSync,copyFileSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const source=fileURLToPath(new URL('../../menu-drone-capture/',import.meta.url));
const output=fileURLToPath(new URL('../src/public/worldloom/assets/menu/',import.meta.url));
mkdirSync(output,{recursive:true});
const ffmpeg=process.env.FFMPEG_PATH||'C:/pinokio/bin/ffmpeg-env/Library/bin/ffmpeg.exe';
function run(args){const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit',windowsHide:true});if(r.status!==0)throw new Error('Drone encoding failed');}
for(const name of ['pond','coast','ridge']){
  run(['-framerate','24','-i',`${source}/${name}/%04d.jpg`,'-an','-c:v','libx264','-threads','4','-preset','medium','-crf','20','-pix_fmt','yuv420p',`${source}/${name}.mp4`]);
}
run(['-i',`${source}/pond.mp4`,'-i',`${source}/coast.mp4`,'-i',`${source}/ridge.mp4`,'-i',`${source}/pond.mp4`,
  '-filter_complex_threads','2','-filter_complex','[0:v][1:v]xfade=transition=fade:duration=0.7:offset=4.3[a];[a][2:v]xfade=transition=fade:duration=0.7:offset=8.6[b];[b][3:v]xfade=transition=fade:duration=0.7:offset=12.9,trim=start=0.7:end=13.6,setpts=PTS-STARTPTS[v]',
  '-map','[v]','-an','-r','24','-c:v','libx264','-threads','4','-preset','medium','-crf','23','-maxrate','10M','-bufsize','20M','-pix_fmt','yuv420p','-movflags','+faststart',`${output}/worldloom-drone-4k.mp4`]);
run(['-i',`${output}/worldloom-drone-4k.mp4`,'-vf','scale=1920:1080:flags=lanczos','-an','-c:v','libx264','-threads','4','-preset','medium','-crf','24','-movflags','+faststart',`${output}/worldloom-drone-1080.mp4`]);
copyFileSync(`${source}/pond/0040.jpg`,`${output}/worldloom-drone-poster.jpg`);
const bytes=statSync(`${output}/worldloom-drone-4k.mp4`).size;
if(bytes>24*1024*1024)throw new Error('4K video exceeds static asset budget');
console.log(JSON.stringify({resolution:'3840x2160',bytes}));
