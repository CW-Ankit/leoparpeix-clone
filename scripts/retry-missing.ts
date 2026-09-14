import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://leoparpeix.com';
const TARGET_DIR = path.resolve(import.meta.dir, '../public');

// Missing assets list to retry sequentially
const RETRY_LIST: string[] = [
  // Playground photos
  'assets/medias/playground/7.jpg',
  'assets/medias/playground/8.jpg',
  'assets/medias/playground/10.jpg',
  'assets/medias/playground/12.jpg',
  'assets/medias/playground/13.jpg',

  // Project 1 slides
  'assets/medias/home/projects/project1-webp/1024/1.webp',
  'assets/medias/home/projects/project1-webp/1024/2.webp',
  'assets/medias/home/projects/project1-webp/1024/3.webp',
  'assets/medias/home/projects/project1-webp/1024/4.webp',
  'assets/medias/home/projects/project1-webp/1024/5.webp',
  'assets/medias/home/projects/project1-webp/1024/6.webp',
  'assets/medias/home/projects/project1-webp/1024/7.webp',
  'assets/medias/home/projects/project1-webp/1024/8.webp',
  'assets/medias/home/projects/project1-webp/1024/9.webp',
  'assets/medias/home/projects/project1-webp/1024/10.webp',
  'assets/medias/home/projects/project1-webp/1024/11.webp',
  'assets/medias/home/projects/project1-webp/1024/12.webp',

  // Project 2 remaining
  'assets/medias/home/projects/project2-webp/1024/2.webp',
  'assets/medias/home/projects/project2-webp/1024/6.webp',

  // Project 3 remaining
  'assets/medias/home/projects/project3-webp/1024/1.webp',
  'assets/medias/home/projects/project3-webp/1024/2.webp',
  'assets/medias/home/projects/project3-webp/1024/3.webp',

  // Project 4 remaining
  'assets/medias/home/projects/project4-webp/1024/9.webp',

  // Project 5 remaining
  'assets/medias/home/projects/project5-webp/1024/1.webp',
  'assets/medias/home/projects/project5-webp/1024/2.webp',
  'assets/medias/home/projects/project5-webp/1024/3.webp',
  'assets/medias/home/projects/project5-webp/1024/4.webp',
  'assets/medias/home/projects/project5-webp/1024/5.webp',
  'assets/medias/home/projects/project5-webp/1024/6.webp',
  'assets/medias/home/projects/project5-webp/1024/7.webp',
  'assets/medias/home/projects/project5-webp/1024/8.webp',
  'assets/medias/home/projects/project5-webp/1024/9.webp',
  'assets/medias/home/projects/project5-webp/1024/10.webp',

  // Project 6 remaining
  'assets/medias/home/projects/project6-webp/1024/1.webp',
  'assets/medias/home/projects/project6-webp/1024/2.webp',
  'assets/medias/home/projects/project6-webp/1024/3.webp',
  'assets/medias/home/projects/project6-webp/1024/4.webp',
  'assets/medias/home/projects/project6-webp/1024/5.webp',

  // Showreel
  'assets/medias/home/showreel-base/showreel.mp4',
];

async function downloadSingle(relPath: string) {
  const destPath = path.join(TARGET_DIR, relPath);
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    if (stat.size > 0) {
      return;
    }
  }

  const url = `${BASE_URL}/${relPath}`;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(35000) });
    if (!res.ok) {
      console.warn(`[FAIL ${res.status}] ${url}`);
      return;
    }
    const buf = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buf));
    console.log(`[RETRY OK ${Math.round(buf.byteLength / 1024)} KB] ${relPath}`);
  } catch (err: any) {
    console.warn(`[RETRY SKIP] ${relPath}: ${err.message}`);
  }
}

async function main() {
  console.log(`Retrying missing files sequentially (${RETRY_LIST.length} total)...`);
  for (const item of RETRY_LIST) {
    await downloadSingle(item);
  }
  console.log('Retry pass complete!');
}

main().catch(console.error);
