import JSZip from 'jszip';

/**
 * Parses a PPTX file object in the browser using JSZip.
 * Extracts slides, titles, body paragraphs, bullet points, and plain text.
 * 
 * @param {File|Blob} file - The uploaded PPTX file object
 * @returns {Promise<{
 *   lessonName: string,
 *   totalSlides: number,
 *   slides: Array<{
 *     slideNumber: number,
 *     title: string,
 *     paragraphs: Array<{ text: string, isBullet: boolean }>
 *   }>,
 *   fullText: string
 * }>}
 */
export async function parsePptxFile(file) {
  if (!file) {
    throw new Error('No file provided to PPTX parser.');
  }

  // Derive default lesson name from filename (e.g., "Lesson_09.pptx" -> "Lesson_09")
  const rawFileName = file.name || 'Lesson_Custom';
  const lessonName = rawFileName.replace(/\.[^/.]+$/, '');

  let zip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch (err) {
    throw new Error(`Failed to read PPTX file as a valid presentation archive: ${err.message}`);
  }

  // Find all slide entries matching ppt/slides/slide{N}.xml
  const slideEntries = Object.keys(zip.files)
    .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
      return numA - numB;
    });

  if (slideEntries.length === 0) {
    throw new Error('No slide XML content found inside this PPTX file.');
  }

  const slides = [];
  const textSections = [];

  for (let idx = 0; idx < slideEntries.length; idx++) {
    const slidePath = slideEntries[idx];
    const slideXml = await zip.files[slidePath].async('string');

    // Extract text runs inside <a:t> within each <a:p> (paragraph)
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

    // Extract structured tables inside <a:tbl>
    const tableMatches = slideXml.match(/<a:tbl\b[\s\S]*?<\/a:tbl>/g) || [];
    const tables = [];
    for (const tblXml of tableMatches) {
      const rowMatches = tblXml.match(/<a:tr\b[\s\S]*?<\/a:tr>/g) || [];
      const tableRows = [];
      for (const trXml of rowMatches) {
        const cellMatches = trXml.match(/<a:tc\b[\s\S]*?<\/a:tc>/g) || [];
        const cells = cellMatches.map((tcXml) => {
          const tMatches = tcXml.match(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/g) || [];
          return tMatches
            .map((t) => t.replace(/<[^>]+>/g, '').trim())
            .filter(Boolean)
            .join(' ');
        }).filter((c) => c.length > 0);
        if (cells.length > 0) {
          tableRows.push(cells);
        }
      }
      if (tableRows.length > 0) {
        tables.push(tableRows);
      }
    }

    let title = '';
    let bodyParagraphs = [];

    if (paragraphs.length > 0) {
      const firstText = paragraphs[0].text;
      // If the first paragraph is concise (<90 chars) and not ending with a period, treat it as title
      if (firstText.length < 90 && !firstText.endsWith('.')) {
        title = firstText;
        bodyParagraphs = paragraphs.slice(1);
      } else {
        title = `Slide ${idx + 1}`;
        bodyParagraphs = paragraphs;
      }
    } else {
      title = `Slide ${idx + 1}`;
    }

    const slideObj = {
      slideNumber: idx + 1,
      title: title || `Slide ${idx + 1}`,
      paragraphs: bodyParagraphs,
      tables
    };

    slides.push(slideObj);

    // Build structured text snippet for AI prompt
    const slideLines = [
      `=== SLIDE ${idx + 1}: ${slideObj.title} ===`,
      ...bodyParagraphs.map((p) => (p.isBullet ? `• ${p.text}` : p.text))
    ];

    if (tables.length > 0) {
      slideLines.push('\n[STRUCTURED TABLE DATA]');
      tables.forEach((t) => {
        t.forEach((row) => {
          slideLines.push(`| ${row.join(' | ')} |`);
        });
        slideLines.push('');
      });
    }

    textSections.push(slideLines.join('\n'));
  }

  const fullText = textSections.join('\n\n');

  return {
    lessonName,
    totalSlides: slides.length,
    slides,
    fullText
  };
}
