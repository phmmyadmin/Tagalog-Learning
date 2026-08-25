import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/#dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // 1. Dashboard screenshot
  await page.screenshot({ path: 'docs/assets/dashboard.png' });
  console.log('✓ Captured dashboard.png');

  // 2. Vocabulary (Dictionary mode) screenshot
  await page.click('nav.header-nav a[href="#vocabulary"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'docs/assets/vocabulary.png' });
  console.log('✓ Captured vocabulary.png');

  // 3. Flashcards (FSRS Study Mode) screenshot
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Flashcards')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Flip the flashcard
  const cardElement = await page.$('.flashcard-container, [style*="perspective"], .card');
  if (cardElement) {
    await cardElement.click();
    await new Promise(r => setTimeout(r, 500));
  }
  await page.screenshot({ path: 'docs/assets/flashcards.png' });
  console.log('✓ Captured flashcards.png');

  // 4. Grammar / Theory screenshot
  await page.click('nav.header-nav a[href="#theory"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'docs/assets/theory.png' });
  console.log('✓ Captured theory.png');

  // 5. Practice Activities screenshot
  await page.click('nav.header-nav a[href="#activities"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'docs/assets/activities.png' });
  console.log('✓ Captured activities.png');

  // 6. Quizzes screenshot
  await page.click('nav.header-nav a[href="#quizzes"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'docs/assets/quizzes.png' });
  console.log('✓ Captured quizzes.png');

  // 7. Import PPTX screenshot
  await page.click('nav.header-nav a[href="#ingest"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'docs/assets/ingest.png' });
  console.log('✓ Captured ingest.png');

  // 8. Settings Modal screenshot
  const headerBtns = await page.$$('header button');
  for (const b of headerBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Settings')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'docs/assets/settings.png' });
  console.log('✓ Captured settings.png');

  await browser.close();
  console.log('🎉 All 7 high-res screenshots captured successfully in docs/assets/!');
}

capture().catch(err => {
  console.error('Failed to capture screenshots:', err);
  process.exit(1);
});
