import { describe, it, expect, beforeEach } from 'vitest';
import JSZip from 'jszip';
import { parsePptxFile } from '../utils/pptxBrowserParser';
import { saveUserLesson, getUserLessons, deleteUserLesson } from '../utils/userLessonsManager';

describe('PPTX Ingestion Pipeline Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly parses an in-memory PPTX archive with XML slides', async () => {
    const zip = new JSZip();

    const slide1Xml = `<?xml version="1.0" encoding="UTF-8"?>
      <p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <p:cSld>
          <p:spTree>
            <p:sp>
              <p:txBody>
                <a:p>
                  <a:r><a:t>Lesson 9: Colors in Tagalog</a:t></a:r>
                </a:p>
                <a:p>
                  <a:pPr lvl="1"/>
                  <a:r><a:t>Pula means Red</a:t></a:r>
                </a:p>
                <a:p>
                  <a:pPr lvl="1"/>
                  <a:r><a:t>Asul means Blue</a:t></a:r>
                </a:p>
              </p:txBody>
            </p:sp>
          </p:spTree>
        </p:cSld>
      </p:sld>`;

    const slide2Xml = `<?xml version="1.0" encoding="UTF-8"?>
      <p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <p:cSld>
          <p:spTree>
            <p:sp>
              <p:txBody>
                <a:p>
                  <a:r><a:t>Color Modifiers</a:t></a:r>
                </a:p>
                <a:p>
                  <a:r><a:t>Kulay is the general word for color.</a:t></a:r>
                </a:p>
              </p:txBody>
            </p:sp>
          </p:spTree>
        </p:cSld>
      </p:sld>`;

    zip.file('ppt/slides/slide1.xml', slide1Xml);
    zip.file('ppt/slides/slide2.xml', slide2Xml);

    const blob = await zip.generateAsync({ type: 'blob' });
    const mockFile = new File([blob], 'Lesson_09.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });

    const parsed = await parsePptxFile(mockFile);

    expect(parsed.lessonName).toBe('Lesson_09');
    expect(parsed.totalSlides).toBe(2);
    expect(parsed.slides[0].title).toBe('Lesson 9: Colors in Tagalog');
    expect(parsed.slides[0].paragraphs[0].text).toBe('Pula means Red');
    expect(parsed.slides[0].paragraphs[0].isBullet).toBe(true);
    expect(parsed.fullText).toContain('=== SLIDE 1: Lesson 9: Colors in Tagalog ===');
  });

  it('integrates parsed lesson into userLessonsManager persistence store', () => {
    const customLesson = {
      id: 'LESSON_09_TEST',
      lessonKey: 'Lesson_09',
      title: 'Lesson 9 — Colors in Tagalog',
      summary: 'Learn colors and adjective modifiers.',
      isDefault: false,
      theory: [{ id: 'THEORY-9-1', topic: 'Colors', table: [{ tagalog: 'Pula', english: 'Red' }] }],
      vocabulary: [{ id: 'VOCAB-901', word: 'Pula', meaning: 'Red', lesson: 'Lesson_09' }],
      activities: [{ id: 'ACT-901', sentence: '___ ang kotse.', target: 'Pula', options: ['Pula', 'Bughaw'] }],
      quiz: {
        quiz_metadata: { lesson: 'Lesson_09', total_questions: 8 },
        questions: Array.from({ length: 8 }).map((_, i) => ({ id: `Q-${i}`, question: `Q${i}`, options: ['A', 'B'], correctIndex: 0 }))
      }
    };

    saveUserLesson(customLesson);
    const stored = getUserLessons();
    const found = stored.find(l => l.lessonKey === 'Lesson_09' || l.id === 'LESSON_09_TEST');

    expect(found).toBeDefined();
    expect(found.title).toBe('Lesson 9 — Colors in Tagalog');
    expect(found.vocabulary).toHaveLength(1);

    // Delete functionality
    deleteUserLesson('Lesson_09');
    const afterDelete = getUserLessons();
    expect(afterDelete.some(l => l.lessonKey === 'Lesson_09')).toBe(false);
  });

  it('extracts OpenXML table structures (| col1 | col2 |) from PPTX slides', async () => {
    const zip = new JSZip();

    const slideWithTableXml = `<?xml version="1.0" encoding="UTF-8"?>
      <p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
        <p:cSld>
          <p:spTree>
            <p:sp>
              <p:txBody>
                <a:p><a:r><a:t>Grammar Pronouns Table</a:t></a:r></a:p>
              </p:txBody>
            </p:sp>
            <p:graphicFrame>
              <a:graphic>
                <a:graphicData>
                  <a:tbl>
                    <a:tr>
                      <a:tc><a:txBody><a:p><a:r><a:t>Tagalog</a:t></a:r></a:p></a:txBody></a:tc>
                      <a:tc><a:txBody><a:p><a:r><a:t>English</a:t></a:r></a:p></a:txBody></a:tc>
                    </a:tr>
                    <a:tr>
                      <a:tc><a:txBody><a:p><a:r><a:t>Ako</a:t></a:r></a:p></a:txBody></a:tc>
                      <a:tc><a:txBody><a:p><a:r><a:t>I / Me</a:t></a:r></a:p></a:txBody></a:tc>
                    </a:tr>
                    <a:tr>
                      <a:tc><a:txBody><a:p><a:r><a:t>Ikaw</a:t></a:r></a:p></a:txBody></a:tc>
                      <a:tc><a:txBody><a:p><a:r><a:t>You</a:t></a:r></a:p></a:txBody></a:tc>
                    </a:tr>
                  </a:tbl>
                </a:graphicData>
              </a:graphic>
            </p:graphicFrame>
          </p:spTree>
        </p:cSld>
      </p:sld>`;

    zip.file('ppt/slides/slide1.xml', slideWithTableXml);
    const blob = await zip.generateAsync({ type: 'blob' });
    const mockFile = new File([blob], 'Lesson_Table_Test.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });

    const parsed = await parsePptxFile(mockFile);
    expect(parsed.slides[0].tables).toBeDefined();
    expect(parsed.slides[0].tables).toHaveLength(1);
    expect(parsed.slides[0].tables[0]).toHaveLength(3); // 3 rows
    expect(parsed.fullText).toContain('| Tagalog | English |');
    expect(parsed.fullText).toContain('| Ako | I / Me |');
    expect(parsed.fullText).toContain('| Ikaw | You |');
  });
});
