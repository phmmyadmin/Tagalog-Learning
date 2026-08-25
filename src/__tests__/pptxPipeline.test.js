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
});
