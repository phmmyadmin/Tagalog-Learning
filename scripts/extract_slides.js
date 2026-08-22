import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const PPTX_DIR = path.join(projectRoot, 'pptx_sources');
const OUTPUT_DATA_DIR = path.join(projectRoot, 'src', 'data', 'slides');
const OUTPUT_MEDIA_DIR = path.join(projectRoot, 'public', 'slides');
const OVERRIDES_PATH = path.join(projectRoot, 'src', 'data', 'slideMapOverrides.json');
const SLIDE_MAP_PATH = path.join(projectRoot, 'src', 'data', 'slideMap.json');

async function extractPptx(pptxFilename) {
  const lessonName = path.basename(pptxFilename, '.pptx');
  const pptxPath = path.join(PPTX_DIR, pptxFilename);

  if (!fs.existsSync(pptxPath)) {
    console.error(`File not found: ${pptxPath}`);
    return null;
  }

  const fileData = fs.readFileSync(pptxPath);
  const zip = await JSZip.loadAsync(fileData);

  const lessonMediaDir = path.join(OUTPUT_MEDIA_DIR, lessonName);
  fs.mkdirSync(lessonMediaDir, { recursive: true });

  // 1. Extract media files (images)
  const mediaFiles = {};
  for (const relativePath of Object.keys(zip.files)) {
    if (relativePath.startsWith('ppt/media/')) {
      const filename = path.basename(relativePath);
      const fileBuffer = await zip.files[relativePath].async('nodebuffer');
      const targetPath = path.join(lessonMediaDir, filename);
      fs.writeFileSync(targetPath, fileBuffer);
      const publicPath = `/slides/${lessonName}/${filename}`;
      mediaFiles[relativePath] = publicPath;
      mediaFiles[filename] = publicPath;
    }
  }

  // 2. Find and sort slide files (ppt/slides/slide1.xml, slide2.xml...)
  const slideEntries = Object.keys(zip.files)
    .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
      return numA - numB;
    });

  const slides = [];

  for (let idx = 0; idx < slideEntries.length; idx++) {
    const slidePath = slideEntries[idx];
    const slideXml = await zip.files[slidePath].async('string');

    // Parse relationship XML if present to link image IDs
    const slideNum = slidePath.match(/slide(\d+)\.xml/)[1];
    const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`;
    const relsMap = {};

    if (zip.files[relsPath]) {
      const relsXml = await zip.files[relsPath].async('string');
      const relMatches = relsXml.matchAll(/Relationship\s+Id="([^"]+)"\s+Type="[^"]*image[^"]*"\s+Target="([^"]+)"/gi);
      for (const match of relMatches) {
        const rId = match[1];
        let target = match[2];
        const targetFilename = path.basename(target);
        if (mediaFiles[targetFilename]) {
          relsMap[rId] = mediaFiles[targetFilename];
        }
      }
    }

    // Extract text runs inside <a:t> tags
    const paragraphs = [];
    const pMatches = slideXml.match(/<a:p\b[\s\S]*?<\/a:p>/g) || [];

    for (const pXml of pMatches) {
      const tMatches = pXml.match(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/g) || [];
      const textRun = tMatches
        .map((t) => t.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
        .join(' ');

      if (textRun) {
        const isBullet = /<a:bu\b/i.test(pXml) || /<a:pPr\b[^>]*\blvl="[1-9]"/i.test(pXml);
        paragraphs.push({
          text: textRun,
          isBullet
        });
      }
    }

    let title = '';
    let bodyParagraphs = [];

    if (paragraphs.length > 0) {
      const firstText = paragraphs[0].text;
      // If first paragraph is short (<90 chars) and not a full sentence ending in period, treat as title
      if (firstText.length < 90 && !firstText.endsWith('.')) {
        title = firstText;
        bodyParagraphs = paragraphs.slice(1);
      } else {
        title = `Slide ${idx + 1}`;
        bodyParagraphs = paragraphs;
      }
    }

    const slideImages = [];
    const blipMatches = slideXml.matchAll(/r:embed="([^"]+)"/g);
    for (const bMatch of blipMatches) {
      const rId = bMatch[1];
      if (relsMap[rId] && !slideImages.includes(relsMap[rId])) {
        slideImages.push(relsMap[rId]);
      }
    }

    slides.push({
      slideNumber: idx + 1,
      title: title || `Slide ${idx + 1}`,
      paragraphs: bodyParagraphs,
      images: slideImages
    });
  }

  const manifest = {
    lesson: lessonName,
    totalSlides: slides.length,
    slides
  };

  fs.mkdirSync(OUTPUT_DATA_DIR, { recursive: true });
  const manifestPath = path.join(OUTPUT_DATA_DIR, `${lessonName}.json`);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`✓ Processed ${lessonName}: ${slides.length} slides extracted.`);
  return manifest;
}

function generateSlideMap(allManifests) {
  console.log('Generating slide-to-concept mapping...');

  let overrides = { theory: {}, vocabulary: { _default_slides: {} }, activities: { _default_slides: {} } };
  if (fs.existsSync(OVERRIDES_PATH)) {
    try {
      overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));
    } catch (e) {
      console.warn('Could not parse slideMapOverrides.json, using defaults.');
    }
  }

  let allTheory = [];
  try {
    const defaultLessonsFile = fs.readFileSync(path.join(projectRoot, 'src', 'data', 'defaultLessons.js'), 'utf8');
    const jsonMatch = defaultLessonsFile.match(/export const defaultLessons = (\[[\s\S]*?\]);\s*$/);
    if (jsonMatch) {
      const defaultLessons = JSON.parse(jsonMatch[1]);
      defaultLessons.forEach((l) => {
        if (Array.isArray(l.theory)) allTheory.push(...l.theory);
      });
    }
  } catch (e) {
    console.warn('Could not read defaultLessons.js for slide mapping:', e.message);
  }

  const slideMap = {
    theory: {},
    vocabulary: {
      _default_slides: overrides.vocabulary?._default_slides || {}
    },
    activities: {
      _default_slides: overrides.activities?._default_slides || {}
    }
  };

  // Map Theory Topics
  for (const topic of allTheory) {
    // If override exists, use it
    if (overrides.theory && overrides.theory[topic.id]) {
      slideMap.theory[topic.id] = overrides.theory[topic.id];
      continue;
    }

    // Auto-match based on slide keyword relevance
    const lessonManifest = allManifests.find((m) => m.lesson === topic.lesson);
    if (!lessonManifest) {
      slideMap.theory[topic.id] = { lesson: topic.lesson, slide: 1, label: topic.topic };
      continue;
    }

    const keywords = [
      topic.topic,
      ...(topic.summary ? topic.summary.split(/\s+/) : []),
      ...(topic.rules ? topic.rules.map((r) => r.article || r.target || '').filter(Boolean) : [])
    ].filter((k) => k.length > 2);

    let bestSlide = 1;
    let maxScore = -1;

    for (const slide of lessonManifest.slides) {
      const slideText = [slide.title, ...slide.paragraphs.map((p) => p.text)].join(' ').toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (slideText.includes(kw.toLowerCase())) {
          score += kw.length;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestSlide = slide.slideNumber;
      }
    }

    slideMap.theory[topic.id] = {
      lesson: topic.lesson,
      slide: bestSlide,
      slideEnd: bestSlide,
      label: topic.topic
    };
  }

  fs.writeFileSync(SLIDE_MAP_PATH, JSON.stringify(slideMap, null, 2));
  console.log(`✓ Slide map generated at ${SLIDE_MAP_PATH}`);
}

async function main() {
  console.log('Extracting PPTX slides to JSON & Media...');

  if (!fs.existsSync(PPTX_DIR)) {
    console.error(`PPTX Directory does not exist: ${PPTX_DIR}`);
    return;
  }

  const pptxFiles = fs.readdirSync(PPTX_DIR).filter((f) => f.endsWith('.pptx'));
  if (pptxFiles.length === 0) {
    console.log('No PPTX files found.');
    return;
  }

  const manifestIndex = [];
  const allManifests = [];

  for (const file of pptxFiles) {
    const manifest = await extractPptx(file);
    if (manifest) {
      allManifests.push(manifest);
      manifestIndex.push({
        lesson: manifest.lesson,
        totalSlides: manifest.totalSlides
      });
    }
  }

  const indexPath = path.join(OUTPUT_DATA_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(manifestIndex, null, 2));

  // Generate slide map
  generateSlideMap(allManifests);

  console.log(`✓ Slide extraction and mapping complete for ${manifestIndex.length} lessons.`);
}

main().catch((err) => {
  console.error('Slide extraction failed:', err);
  process.exit(1);
});
