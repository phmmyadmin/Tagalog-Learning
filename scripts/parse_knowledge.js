import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.resolve(__dirname, '..');
const kbPath = path.join(baseDir, 'tagalog_knowledge_base.md');
const outputDir = path.join(baseDir, 'src', 'data');
const outputPath = path.join(outputDir, 'tagalogData.json');

try {
  console.log('Reading tagalog_knowledge_base.md...');
  const mdContent = fs.readFileSync(kbPath, 'utf8');

  // 1. Extract JSON block
  const jsonMatch = mdContent.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch) {
    throw new Error('No valid JSON block found in tagalog_knowledge_base.md');
  }

  const parsedData = JSON.parse(jsonMatch[1]);

  // 2. Parse Markdown Vocabulary Table in SECTION 2
  const vocabTableMatch = mdContent.match(/\| Tagalog Term \| English Meaning \| Part of Speech \| Lesson Origin \| Usage Example \|[\s\S]*?\n\n/);
  
  const vocabulary = [];
  if (vocabTableMatch) {
    const lines = vocabTableMatch[0].trim().split('\n').slice(2); // Skip header & separator
    lines.forEach((line, index) => {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 5) {
        const word = cols[0].replace(/\*\*/g, '');
        const meaning = cols[1];
        const partOfSpeech = cols[2];
        const lesson = cols[3];
        const example = cols[4];

        vocabulary.push({
          id: `VOCAB-${String(index + 1).padStart(3, '0')}`,
          word,
          meaning,
          partOfSpeech,
          lesson,
          example
        });
      }
    });
  }

  parsedData.vocabulary = vocabulary;

  // 3. Parse Markdown Exercises in SECTION 3
  const exerciseBlocks = mdContent.split(/####\s*`([^`]+)`/);
  const activities = [];

  for (let i = 1; i < exerciseBlocks.length; i += 2) {
    const exId = exerciseBlocks[i].trim();
    const exContent = exerciseBlocks[i + 1];

    const promptMatch = exContent.match(/\*\s*\*\*Prompt\*\*:\s*([\s\S]*?)\n\*/);
    const typeMatch = exContent.match(/\*\s*\*\*Type\*\*:\s*`([^`]+)`/);
    const answerMatch = exContent.match(/\*\s*\*\*Correct Answer\*\*:\s*([\s\S]*?)\n\*/);
    const explanationMatch = exContent.match(/\*\s*\*\*Grammar Explanation\*\*:\s*([\s\S]*?)(?=\n\n|\n#|$)/);

    // Determine lesson from ID (e.g. EX-L02-001 -> Lesson_02)
    let lesson = 'Lesson_02';
    const lessonCodeMatch = exId.match(/L(\d+)/);
    if (lessonCodeMatch) {
      lesson = `Lesson_${lessonCodeMatch[1].padStart(2, '0')}`;
    }

    if (promptMatch && answerMatch) {
      const rawAnswer = answerMatch[1].trim().replace(/^`|`$/g, '');
      // Handle multiple acceptable answers separated by '/'
      const acceptedAnswers = rawAnswer.split('/').map(a => a.trim().replace(/^`|`$/g, ''));

      activities.push({
        id: exId,
        lesson,
        type: typeMatch ? typeMatch[1].trim() : 'fill_in_blank',
        prompt: promptMatch[1].trim(),
        correctAnswer: rawAnswer,
        acceptedAnswers: acceptedAnswers,
        explanation: explanationMatch ? explanationMatch[1].trim() : ''
      });
    }
  }

  parsedData.activities = activities;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 2), 'utf8');
  console.log(`✓ Successfully extracted ${parsedData.theory.length} theory topics, ${vocabulary.length} vocabulary terms, and ${activities.length} activity exercises.`);
  console.log(`✓ Generated data file at: ${outputPath}`);
} catch (error) {
  console.error('✗ Error parsing knowledge base:', error.message);
  process.exit(1);
}
