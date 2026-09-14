import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://leoparpeix.com';
const TARGET_DIR = path.resolve(import.meta.dir, '../public');

const ESSENTIAL_ASSETS: string[] = [
  // Root metadata & icons
  'favicon.ico',
  'favicon-32x32.png',
  'favicon-16x16.png',
  'apple-touch-icon.png',
  'preview.jpg',

  // Fonts
  'assets/fonts/monumentgrotesk-regular.woff2',
  'assets/fonts/monumentgrotesk-regular.woff',
  'assets/fonts/avantt-variable.ttf',

  // 3D Models
  'assets/models/global/bee/bee_v4.glb',
  'assets/models/global/flower/flower_v2.glb',
  'assets/models/global/fruits/orange.glb',
  'assets/models/global/fruits/raisin.glb',
  'assets/models/home/scene_v9.glb',
  'assets/models/about/scene_v15.glb',

  // Audio
  'assets/sounds/compressed/ambient.aac',
  'assets/sounds/compressed/fruit1.aac',
  'assets/sounds/compressed/fruit2.aac',
  'assets/sounds/compressed/pageTransition.aac',

  // Textures - Clouds
  'assets/textures/global/clouds/cloud1.png',
  'assets/textures/global/clouds/cloud2.png',
  'assets/textures/global/clouds/cloud3.png',
  'assets/textures/global/clouds/cloud4.png',
  'assets/textures/global/clouds/cloud5.png',
  'assets/textures/global/clouds/cloud6.png',

  // Textures - Shaders & Materials
  'assets/textures/global/noise.jpeg',
  'assets/textures/global/waterDeformationTexture.jpeg',
  'assets/textures/about/scene/texMontagne.png',
  'assets/textures/about/ground-webp/512/diffuse.webp',
  'assets/textures/about/ground-webp/512/normal.webp',
  'assets/textures/about/ground-webp/512/roughness.webp',
  'assets/textures/about/ground-webp/512/ao.webp',
  'assets/textures/about/leaves-webp/256/leaves.webp',
  'assets/textures/global/bee-webp/1024/bee.webp',
  'assets/textures/global/flower-webp/1024/flower.webp',

  // About media
  'assets/medias/about/content/content.jpg',
  'assets/medias/about/intro/intro.jpg',

  // Archives images
  'assets/medias/home/archives-base/dna.jpg',
  'assets/medias/home/archives-base/16-AubergerLaChatelaine.jpg',
  'assets/medias/home/archives-base/27-Omexom.jpg',

  // Playground photos
  'assets/medias/playground/6.jpg',
  'assets/medias/playground/7.jpg',
  'assets/medias/playground/8.jpg',
  'assets/medias/playground/10.jpg',
  'assets/medias/playground/12.jpg',
  'assets/medias/playground/13.jpg',
];

// Project slides (project1: 12, project2: 12, project3: 11, project4: 9, project5: 10, project6: 11)
const PROJECT_COUNTS: Record<string, number> = {
  project1: 12,
  project2: 12,
  project3: 11,
  project4: 9,
  project5: 10,
  project6: 11,
};

for (const [proj, count] of Object.entries(PROJECT_COUNTS)) {
  for (let i = 1; i <= count; i++) {
    ESSENTIAL_ASSETS.push(`assets/medias/home/projects/${proj}-webp/1024/${i}.webp`);
  }
}

// Media videos (archives & playground & showreel)
const VIDEO_ASSETS: string[] = [
  'assets/medias/home/showreel-base/showreel.mp4',
  'assets/medias/home/archives-base/7-PortfolioGab.mp4',
  'assets/medias/home/archives-base/8-Unity-2025.mp4',
  'assets/medias/home/archives-base/9-Pangaia.mp4',
  'assets/medias/home/archives-base/11-Merrel.mp4',
  'assets/medias/home/archives-base/13-Tougo.mp4',
  'assets/medias/home/archives-base/14-DrakeHotel.mp4',
  'assets/medias/home/archives-base/15-Vooban.mp4',
  'assets/medias/home/archives-base/17-Unity-2024.mp4',
  'assets/medias/home/archives-base/18-TheHayAdams.mp4',
  'assets/medias/home/archives-base/19-PrisonBoss.mp4',
  'assets/medias/home/archives-base/20-Palosanto.mp4',
  'assets/medias/home/archives-base/21-Longines.mp4',
  'assets/medias/home/archives-base/23-ImmersiveGarden.mp4',
  'assets/medias/home/archives-base/24-LonginesDolceVita.mp4',
  'assets/medias/home/archives-base/25-Omega.mp4',
  'assets/medias/home/archives-base/26-Aleph.mp4',
  'assets/medias/home/archives-base/28-TourDeFrance.mp4',
  'assets/medias/home/archives-base/29-Manza.mp4',
  'assets/medias/playground/1.mp4',
  'assets/medias/playground/2.mp4',
  'assets/medias/playground/3.mp4',
  'assets/medias/playground/4.mp4',
  'assets/medias/playground/5.mp4',
  'assets/medias/playground/9.mp4',
  'assets/medias/playground/11.mp4',
  'assets/medias/playground/14.mp4',
  'assets/medias/playground/15.mp4',
];

async function downloadFile(relPath: string, timeoutMs = 25000): Promise<boolean> {
  const destPath = path.join(TARGET_DIR, relPath);
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    if (stat.size > 0) {
      return true; // Already exists
    }
  }

  const url = `${BASE_URL}/${relPath}`;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`[FAIL ${res.status}] ${url}`);
      return false;
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`[OK ${Math.round(buffer.byteLength / 1024)} KB] ${relPath}`);
    return true;
  } catch (err: any) {
    clearTimeout(timer);
    console.warn(`[TIMEOUT/ERR] ${relPath}: ${err.name || err.message}`);
    return false;
  }
}

async function main() {
  console.log(`=== Phase 1: Downloading Essential Assets (${ESSENTIAL_ASSETS.length}) ===`);
  const chunk = 8;
  for (let i = 0; i < ESSENTIAL_ASSETS.length; i += chunk) {
    const slice = ESSENTIAL_ASSETS.slice(i, i + chunk);
    await Promise.all(slice.map(s => downloadFile(s, 20000)));
  }

  console.log(`=== Phase 2: Downloading Media Videos (${VIDEO_ASSETS.length}) ===`);
  for (const v of VIDEO_ASSETS) {
    await downloadFile(v, 30000);
  }

  console.log('Finished downloading assets!');
}

main().catch(console.error);
