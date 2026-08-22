/**
 * Self-Contained Default Tagalog Master Lessons (Seed for Supabase & LocalStorage)
 */

export const defaultLessons = [
  {
    "id": "LESSON_Lesson_02",
    "lessonKey": "Lesson_02",
    "title": "Lesson 2 — Articles, Word Order, Pluralization & Basic Tenses",
    "summary": "Proper and common noun articles (si/sina, ang/ang mga), direct vs inverted word order, pluralization, and basic verb tenses introduction.",
    "createdAt": "2026-08-21T00:00:00.000Z",
    "isDefault": true,
    "theory": [
      {
        "id": "THEORY-01",
        "topic": "Articles in Tagalog",
        "lesson": "Lesson_02",
        "summary": "Rules for using proper noun articles and common noun articles in singular and plural forms.",
        "rules": [
          {
            "article": "si",
            "target": "Singular proper noun (person's name)",
            "example_tagalog": "Si Liza ay babae.",
            "example_english": "Liza is a woman."
          },
          {
            "article": "sina",
            "target": "Plural proper nouns (two or more people)",
            "example_tagalog": "Sina Simon at Tom ay mababait.",
            "example_english": "Simon and Tom are good."
          },
          {
            "article": "ang",
            "target": "Singular common noun or place name",
            "example_tagalog": "Ang bata ay mabait.",
            "example_english": "The child is good."
          },
          {
            "article": "ang mga",
            "target": "Plural common nouns or places (pronounced 'manga')",
            "example_tagalog": "Ang mga bata at ang mga aso ay mababait.",
            "example_english": "The children and the dogs are good."
          }
        ]
      },
      {
        "id": "THEORY-02",
        "topic": "Sentence Structure and Word Order",
        "lesson": "Lesson_02",
        "summary": "Tagalog features two main word orders: Direct Order (Subject-Predicate with 'ay') and Inverted Order (Predicate-Subject without 'ay'). The inverted order is more natural in spoken Tagalog.",
        "rules": [
          {
            "order_type": "Direct Order (Subject-Predicate)",
            "has_ay": true,
            "pattern": "[Subject] + ay + [Predicate]",
            "example_tagalog": "Ang bahay ay malaki.",
            "example_english": "The house is big."
          },
          {
            "order_type": "Inverted / Transposed Order (Predicate-Subject)",
            "has_ay": false,
            "pattern": "[Predicate] + [Subject]",
            "example_tagalog": "Malaki ang bahay.",
            "example_english": "The house is big."
          },
          {
            "order_type": "Inverted Order with Plural Subject",
            "has_ay": false,
            "pattern": "mga + [Nouns] + ang + [Names/Places]",
            "example_tagalog": "Mga lungsod ang Manila at Cebu.",
            "example_english": "Manila and Cebu are cities."
          },
          {
            "order_type": "Contraction: 'ay' shortens to 'y after vowels",
            "has_ay": true,
            "pattern": "[Pronoun ending in vowel]'y + [Predicate]",
            "example_tagalog": "Ako'y si John.",
            "example_english": "I am John."
          }
        ]
      },
      {
        "id": "THEORY-03",
        "topic": "Pluralization of Adjectives and Nouns",
        "lesson": "Lesson_02",
        "summary": "Adjectives form their plural by duplicating the first syllable of the root word. Nouns are pluralized using the marker 'mga'. The plurality rule states that either the subject or predicate may be plural; pluralizing both is optional.",
        "rules": [
          {
            "rule": "Adjective plural: duplicate first syllable of root",
            "example": "mabait (good) -> mababait (good, plural)"
          },
          {
            "rule": "Adjective plural: duplicate first syllable of root",
            "example": "maganda (beautiful) -> magaganda (beautiful, plural)"
          },
          {
            "rule": "Adjective plural: duplicate first syllable of root",
            "example": "malaki (big) -> malalaki (big, plural)"
          },
          {
            "rule": "Adjective plural: duplicate first syllable of root",
            "example": "marunong (intelligent) -> marurunong (intelligent, plural)"
          },
          {
            "rule": "Adjective plural: duplicate first syllable of root",
            "example": "malinis (clean) -> malilinis (clean, plural)"
          },
          {
            "rule": "Adjective plural: duplicate first syllable of root",
            "example": "malusog (healthy) -> malulusog (healthy, plural)"
          },
          {
            "rule": "Adjective plural: duplicate first syllable of root",
            "example": "masipag (hardworking) -> masisipag (hardworking, plural)"
          },
          {
            "rule": "Noun pluralization using marker 'mga'",
            "example": "bata (child) -> mga bata (children)"
          }
        ]
      },
      {
        "id": "THEORY-08",
        "topic": "Basic Verb Tenses (Introduction)",
        "lesson": "Lesson_02",
        "summary": "Tagalog verbs change form to indicate tense. Three basic forms are introduced: past (completed), present (ongoing), and future (not yet started).",
        "rules": [
          {
            "tense": "Past (Completed)",
            "pattern": "nag- prefix + root",
            "example": "naglaro (played)"
          },
          {
            "tense": "Present (Ongoing)",
            "pattern": "nag- prefix + duplicated first syllable + root",
            "example": "naglalaro (is playing)"
          },
          {
            "tense": "Future (Not yet started)",
            "pattern": "mag- prefix + duplicated first syllable + root",
            "example": "maglalaro (will play)"
          },
          {
            "tense": "Past (Completed)",
            "pattern": "Example with kumain",
            "example": "kumain (ate)"
          },
          {
            "tense": "Present (Ongoing)",
            "pattern": "Example with kumain",
            "example": "kumakain (is eating)"
          },
          {
            "tense": "Past (Completed)",
            "pattern": "Example with luto",
            "example": "nagluto (cooked)"
          },
          {
            "tense": "Present (Ongoing)",
            "pattern": "Example with luto",
            "example": "nagluluto (is cooking)"
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "id": "VOCAB-002",
        "word": "aklat",
        "meaning": "Book",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Ang aklat ni Paulo."
      },
      {
        "id": "VOCAB-004",
        "word": "ang",
        "meaning": "The (singular marker)",
        "partOfSpeech": "Article",
        "lesson": "Lesson_02",
        "example": "Ang bata ay mabait."
      },
      {
        "id": "VOCAB-005",
        "word": "araw",
        "meaning": "Sun / Day",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Magandang araw."
      },
      {
        "id": "VOCAB-006",
        "word": "aso",
        "meaning": "Dog",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Ang mga aso ay mababait."
      },
      {
        "id": "VOCAB-008",
        "word": "babae",
        "meaning": "Woman / Girl",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Si Liza ay babae."
      },
      {
        "id": "VOCAB-009",
        "word": "bago",
        "meaning": "New",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 05",
        "example": "Ang baro mo ay bago."
      },
      {
        "id": "VOCAB-010",
        "word": "bahay",
        "meaning": "House",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Malaki ang bahay."
      },
      {
        "id": "VOCAB-011",
        "word": "bansa",
        "meaning": "Nation / Country",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Malaki ang bansa."
      },
      {
        "id": "VOCAB-012",
        "word": "bata",
        "meaning": "Child / Young",
        "partOfSpeech": "Noun / Adjective",
        "lesson": "Lesson_02",
        "example": "Siya ay bata."
      },
      {
        "id": "VOCAB-015",
        "word": "bulaklak",
        "meaning": "Flower",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Maganda ang bulaklak."
      },
      {
        "id": "VOCAB-026",
        "word": "hangin",
        "meaning": "Wind",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Malamig ang hangin."
      },
      {
        "id": "VOCAB-031",
        "word": "isda",
        "meaning": "Fish",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Masarap ang isda."
      },
      {
        "id": "VOCAB-038",
        "word": "kapé",
        "meaning": "Coffee",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 03",
        "example": "Umiinom ng kape."
      },
      {
        "id": "VOCAB-040",
        "word": "kotse",
        "meaning": "Car",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Luma ang kotse."
      },
      {
        "id": "VOCAB-041",
        "word": "kumakain",
        "meaning": "Eating (present tense)",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_02",
        "example": "Kumakain ang bata."
      },
      {
        "id": "VOCAB-044",
        "word": "lapis",
        "meaning": "Pencil",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Ang lapis ni Helen."
      },
      {
        "id": "VOCAB-045",
        "word": "luma",
        "meaning": "Old (for inanimate objects)",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 05",
        "example": "Luma ang kotse."
      },
      {
        "id": "VOCAB-046",
        "word": "lungsod",
        "meaning": "City",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Ang Manila ay lungsod."
      },
      {
        "id": "VOCAB-047",
        "word": "lugar",
        "meaning": "Place",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Maganda ang lugar."
      },
      {
        "id": "VOCAB-048",
        "word": "mababa",
        "meaning": "Low",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Mababa ang mesa."
      },
      {
        "id": "VOCAB-049",
        "word": "mabait",
        "meaning": "Good / Kind",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Mabait si Peter."
      },
      {
        "id": "VOCAB-051",
        "word": "mabuti",
        "meaning": "Good (condition / quality)",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Mabuti ang lagay."
      },
      {
        "id": "VOCAB-053",
        "word": "maganda",
        "meaning": "Beautiful",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Si Ruth ay maganda."
      },
      {
        "id": "VOCAB-055",
        "word": "magkapatid",
        "meaning": "Siblings",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 03",
        "example": "Magkapatid sila."
      },
      {
        "id": "VOCAB-056",
        "word": "mahal",
        "meaning": "Expensive / Beloved",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Mahal ang relo."
      },
      {
        "id": "VOCAB-057",
        "word": "mahirap",
        "meaning": "Poor / Difficult",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 03",
        "example": "Mahirap kami."
      },
      {
        "id": "VOCAB-060",
        "word": "mainit",
        "meaning": "Hot",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Mainit ang kape."
      },
      {
        "id": "VOCAB-062",
        "word": "malamig",
        "meaning": "Cold",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 05",
        "example": "Malamig ang tubig."
      },
      {
        "id": "VOCAB-063",
        "word": "malaki",
        "meaning": "Big",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Malaki ang bahay."
      },
      {
        "id": "VOCAB-065",
        "word": "malinis",
        "meaning": "Clean",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Malinis ang sapatos."
      },
      {
        "id": "VOCAB-066",
        "word": "maliit",
        "meaning": "Small",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Maliit ito."
      },
      {
        "id": "VOCAB-067",
        "word": "malusog",
        "meaning": "Healthy",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 03",
        "example": "Malusog ako."
      },
      {
        "id": "VOCAB-071",
        "word": "marunong / matalino",
        "meaning": "Intelligent / Learned",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 03",
        "example": "Marunong si Peter."
      },
      {
        "id": "VOCAB-074",
        "word": "masarap",
        "meaning": "Delicious",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Masarap ang pagkain."
      },
      {
        "id": "VOCAB-076",
        "word": "mataas",
        "meaning": "High / Tall",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Mataas ang bundok."
      },
      {
        "id": "VOCAB-077",
        "word": "mataba",
        "meaning": "Fat",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Mataba ang aso."
      },
      {
        "id": "VOCAB-079",
        "word": "matanda",
        "meaning": "Old (animate beings)",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Matandang lalaki."
      },
      {
        "id": "VOCAB-083",
        "word": "mesa / lamesa",
        "meaning": "Table",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Malinis ang mesa."
      },
      {
        "id": "VOCAB-084",
        "word": "mga",
        "meaning": "Plural marker",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_02",
        "example": "Ang mga bata."
      },
      {
        "id": "VOCAB-085",
        "word": "mura",
        "meaning": "Cheap",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Mura ang pagkain."
      },
      {
        "id": "VOCAB-086",
        "word": "naglalaro",
        "meaning": "Playing (present tense)",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_02, 03",
        "example": "Siya ay naglalaro."
      },
      {
        "id": "VOCAB-087",
        "word": "nagluluto",
        "meaning": "Cooking (present tense)",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_02",
        "example": "Nagluluto ang babae."
      },
      {
        "id": "VOCAB-089",
        "word": "paaralan",
        "meaning": "School",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Ang paaralan ay malaki."
      },
      {
        "id": "VOCAB-090",
        "word": "pagkain",
        "meaning": "Food",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04, 05",
        "example": "Masarap ang pagkain."
      },
      {
        "id": "VOCAB-092",
        "word": "pangit",
        "meaning": "Ugly",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02",
        "example": "Pangit ang aso."
      },
      {
        "id": "VOCAB-093",
        "word": "papél",
        "meaning": "Paper",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Ang papél ni John."
      },
      {
        "id": "VOCAB-095",
        "word": "pusa",
        "meaning": "Cat",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Mabait ang pusa."
      },
      {
        "id": "VOCAB-097",
        "word": "sapatos",
        "meaning": "Shoes",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Malilinis ang sapatos."
      },
      {
        "id": "VOCAB-100",
        "word": "silya",
        "meaning": "Chair",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Ang silya ay bago."
      },
      {
        "id": "VOCAB-101",
        "word": "simbahan",
        "meaning": "Church",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02",
        "example": "Malaki ang simbahan."
      },
      {
        "id": "VOCAB-106",
        "word": "tubig",
        "meaning": "Water",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Mainit ang tubig."
      }
    ],
    "activities": [
      {
        "id": "EX-L02-001",
        "lesson": "Lesson_02",
        "type": "fill_in_blank",
        "prompt": "Complete the sentence referring to Ruth and Peter (siblings): `___ Ruth at Peter ay magkapatid.`",
        "correctAnswer": "Sina",
        "acceptedAnswers": [
          "Sina"
        ],
        "explanation": "`Sina` is used because it precedes multiple proper names of people."
      },
      {
        "id": "EX-L02-002",
        "lesson": "Lesson_02",
        "type": "fill_in_blank",
        "prompt": "Complete the sentence to say \"The children are clean\": `___ ___ bata ay malilinis.`",
        "correctAnswer": "Ang mga",
        "acceptedAnswers": [
          "Ang mga"
        ],
        "explanation": "The plural article for common nouns consists of `ang mga`."
      },
      {
        "id": "EX-L02-003",
        "lesson": "Lesson_02",
        "type": "fill_in_blank",
        "prompt": "Complete the sentence: `___ Amerika at Aprika ay malalaki.`",
        "correctAnswer": "Ang",
        "acceptedAnswers": [
          "Ang"
        ],
        "explanation": "The article `ang` is used before place names. It is acceptable to omit the second `ang`."
      },
      {
        "id": "EX-L02-004",
        "lesson": "Lesson_02",
        "type": "translation",
        "prompt": "Translate \"The house is big\" into inverted word order (predicate first, without *ay*).",
        "correctAnswer": "Malaki ang bahay.",
        "acceptedAnswers": [
          "Malaki ang bahay."
        ],
        "explanation": "In inverted order, the adjective (*Malaki*) comes first, followed by *ang bahay*. The word *ay* is dropped."
      },
      {
        "id": "EX-L02-005",
        "lesson": "Lesson_02",
        "type": "translation",
        "prompt": "Translate \"Peter is intelligent\" using subject-predicate word order.",
        "correctAnswer": "Si Peter ay marunong.",
        "acceptedAnswers": [
          "Si Peter ay marunong."
        ],
        "explanation": "In direct word order, `si` precedes the proper noun, followed by `ay` and the adjective."
      },
      {
        "id": "EX-L02-006",
        "lesson": "Lesson_02",
        "type": "translation",
        "prompt": "Translate \"The shoes are clean\" into Tagalog.",
        "correctAnswer": "Ang mga sapatos ay malilinis.` / `Malilinis ang mga sapatos.",
        "acceptedAnswers": [
          "Ang mga sapatos ay malilinis.",
          "Malilinis ang mga sapatos."
        ],
        "explanation": "`Malilinis` is the plural form of `malinis` (clean), formed by duplicating the first syllable."
      }
    ],
    "quiz": {
      "quiz_metadata": {
        "id": "LESSON_02_QUIZ",
        "lesson": "Lesson_02",
        "title": "Lesson 2 Mastery Exam",
        "topic": "Articles, Word Order & Pluralization",
        "total_questions": 8,
        "created_at": "2026-08-22T13:00:00Z"
      },
      "questions": [
        {
          "id": "L02-Q01",
          "type": "multiple_choice",
          "topic": "Proper Noun Articles",
          "lesson": "Lesson_02",
          "prompt": "Which article marker is used before a singular proper name of a person (e.g. '___ Liza ay babae')?",
          "options": [
            "Si",
            "Sina",
            "Ang",
            "Ang mga"
          ],
          "correct_answer": "Si",
          "explanation": "'Si' is the singular proper noun marker placed before a person's name (e.g. Si Liza ay babae)."
        },
        {
          "id": "L02-Q02",
          "type": "multiple_choice",
          "topic": "Plural Proper Noun Articles",
          "lesson": "Lesson_02",
          "prompt": "Which article marker is used before two or more proper names of people (e.g. '___ Simon at Tom')?",
          "options": [
            "Sina",
            "Si",
            "Ang mga",
            "Ang"
          ],
          "correct_answer": "Sina",
          "explanation": "'Sina' is the plural proper noun marker used for multiple named people (e.g. Sina Simon at Tom ay mababait)."
        },
        {
          "id": "L02-Q03",
          "type": "multiple_choice",
          "topic": "Common Noun Articles",
          "lesson": "Lesson_02",
          "prompt": "Which article is used before a singular common noun or place name (e.g. 'the child')?",
          "options": [
            "Ang",
            "Ang mga",
            "Si",
            "Sina"
          ],
          "correct_answer": "Ang",
          "explanation": "'Ang' is the singular article for common nouns and place names (e.g. Ang bata ay mabait)."
        },
        {
          "id": "L02-Q04",
          "type": "multiple_choice",
          "topic": "Plural Common Nouns",
          "lesson": "Lesson_02",
          "prompt": "How do you form the plural of a common noun like 'bata' (child)?",
          "options": [
            "Ang mga bata",
            "Ang batamga",
            "Sina bata",
            "Si mga bata"
          ],
          "correct_answer": "Ang mga bata",
          "explanation": "'Ang mga' (pronounced 'manga') is placed before common nouns to make them plural."
        },
        {
          "id": "L02-Q05",
          "type": "fill_in_blank",
          "topic": "Inverted Word Order (No AY)",
          "lesson": "Lesson_02",
          "prompt": "In inverted (natural spoken) word order without 'ay', how do you say 'The house is big'? ______",
          "correct_answer": "Malaki ang bahay.",
          "accepted_answers": [
            "Malaki ang bahay",
            "Malaki ang bahay."
          ],
          "explanation": "Inverted word order puts the predicate first and removes 'ay': 'Malaki ang bahay.'"
        },
        {
          "id": "L02-Q06",
          "type": "multiple_choice",
          "topic": "Pluralization of Adjectives",
          "lesson": "Lesson_02",
          "prompt": "How do Tagalog adjectives form their plural form (e.g. 'mabait' -> 'mababait')?",
          "options": [
            "By duplicating the first syllable of the root word",
            "By adding the prefix 'mga-'",
            "By adding the suffix '-in'",
            "By doubling the entire adjective"
          ],
          "correct_answer": "By duplicating the first syllable of the root word",
          "explanation": "Adjectives duplicate the first syllable of the root: bait -> ma-ba-bait, ganda -> ma-ga-ganda."
        },
        {
          "id": "L02-Q07",
          "type": "fill_in_blank",
          "topic": "Plural Adjective Forms",
          "lesson": "Lesson_02",
          "prompt": "What is the plural form of the adjective 'maganda' (beautiful)? ______",
          "correct_answer": "magaganda",
          "accepted_answers": [
            "magaganda",
            "Magaganda"
          ],
          "explanation": "Root: ganda. Duplicating first syllable 'ga' yields 'magaganda'."
        },
        {
          "id": "L02-Q08",
          "type": "multiple_choice",
          "topic": "Contraction of AY",
          "lesson": "Lesson_02",
          "prompt": "How does 'Ako ay si John' contract when the word before 'ay' ends in a vowel?",
          "options": [
            "Ako'y si John.",
            "Ako ay John.",
            "Ako si John.",
            "Ako'y ay John."
          ],
          "correct_answer": "Ako'y si John.",
          "explanation": "The particle 'ay' shortens to ''y' when attached to words ending in vowels: 'Ako'y si John.'"
        }
      ]
    }
  },
  {
    "id": "LESSON_Lesson_03",
    "lessonKey": "Lesson_03",
    "title": "Lesson 3 — Nominative Personal Pronouns",
    "summary": "Nominative personal pronouns (ako, ikaw/ka, siya, kami, tayo, kayo, sila), inclusivity/exclusivity, and politeness rules.",
    "createdAt": "2026-08-21T00:00:00.000Z",
    "isDefault": true,
    "theory": [
      {
        "id": "THEORY-04",
        "topic": "Nominative Personal Pronouns",
        "lesson": "Lesson_03",
        "summary": "Nominative pronouns function as the subject of a sentence. They can appear at the beginning (before 'ay') or after the predicate in inverted order. The linker 'ay' may be shortened to ''y' when the preceding word ends in a vowel.",
        "table": [
          {
            "pronoun": "ako",
            "meaning": "I",
            "type": "1st Person Singular",
            "contraction": "Ako'y"
          },
          {
            "pronoun": "ikaw / ka",
            "meaning": "You (singular)",
            "type": "2nd Person Singular",
            "usage": "'ikaw' at sentence start, 'ka' after predicate"
          },
          {
            "pronoun": "siya",
            "meaning": "He / She",
            "type": "3rd Person Singular",
            "contraction": "Siya'y"
          },
          {
            "pronoun": "kami",
            "meaning": "We (exclusive — excludes listener)",
            "type": "1st Person Plural (excl.)",
            "contraction": "Kami'y"
          },
          {
            "pronoun": "tayo",
            "meaning": "We (inclusive — includes listener)",
            "type": "1st Person Plural (incl.)",
            "contraction": "Tayo'y"
          },
          {
            "pronoun": "kayo",
            "meaning": "You (plural / polite singular)",
            "type": "2nd Person Plural",
            "contraction": "Kayo'y",
            "polite": "Used with 'po' for respect"
          },
          {
            "pronoun": "sila",
            "meaning": "They / Polite singular",
            "type": "3rd Person Plural",
            "contraction": "Sila'y",
            "polite": "Used with 'po' for respect"
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "id": "VOCAB-001",
        "word": "ako",
        "meaning": "I / Me",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_03",
        "example": "Ako ay si John."
      },
      {
        "id": "VOCAB-024",
        "word": "guro",
        "meaning": "Teacher",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_03, 05",
        "example": "Kayo po ba ay guro?"
      },
      {
        "id": "VOCAB-028",
        "word": "ikaw / ka",
        "meaning": "You (singular)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_03",
        "example": "Ikaw ay marunong. / Marunong ka."
      },
      {
        "id": "VOCAB-035",
        "word": "kami",
        "meaning": "We (exclusive)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_03",
        "example": "Kami ay nag-aaral."
      },
      {
        "id": "VOCAB-038",
        "word": "kapé",
        "meaning": "Coffee",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 03",
        "example": "Umiinom ng kape."
      },
      {
        "id": "VOCAB-039",
        "word": "kayo",
        "meaning": "You (plural / polite)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_03",
        "example": "Kayo ay mga Pilipino."
      },
      {
        "id": "VOCAB-054",
        "word": "magkaibigan",
        "meaning": "Friends",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_03",
        "example": "Tayo'y magkaibigan."
      },
      {
        "id": "VOCAB-055",
        "word": "magkapatid",
        "meaning": "Siblings",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 03",
        "example": "Magkapatid sila."
      },
      {
        "id": "VOCAB-057",
        "word": "mahirap",
        "meaning": "Poor / Difficult",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 03",
        "example": "Mahirap kami."
      },
      {
        "id": "VOCAB-059",
        "word": "maingay",
        "meaning": "Noisy",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_03, 04",
        "example": "Maingay kayo."
      },
      {
        "id": "VOCAB-067",
        "word": "malusog",
        "meaning": "Healthy",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 03",
        "example": "Malusog ako."
      },
      {
        "id": "VOCAB-070",
        "word": "marami",
        "meaning": "Plenty / Many",
        "partOfSpeech": "Adjective / Adverb",
        "lesson": "Lesson_03, 04",
        "example": "Marami iyan."
      },
      {
        "id": "VOCAB-071",
        "word": "marunong / matalino",
        "meaning": "Intelligent / Learned",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 03",
        "example": "Marunong si Peter."
      },
      {
        "id": "VOCAB-075",
        "word": "masipag",
        "meaning": "Industrious / Hardworking",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_03",
        "example": "Masipag ako."
      },
      {
        "id": "VOCAB-080",
        "word": "matangkad",
        "meaning": "Tall (person)",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_03",
        "example": "Matangkad ka."
      },
      {
        "id": "VOCAB-086",
        "word": "naglalaro",
        "meaning": "Playing (present tense)",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_02, 03",
        "example": "Siya ay naglalaro."
      },
      {
        "id": "VOCAB-088",
        "word": "nag-aaral",
        "meaning": "Studying (present tense)",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_03",
        "example": "Nag-aaral kami."
      },
      {
        "id": "VOCAB-099",
        "word": "sila",
        "meaning": "They",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_03",
        "example": "Sila ay magkaibigan."
      },
      {
        "id": "VOCAB-102",
        "word": "siya",
        "meaning": "He / She",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_03",
        "example": "Siya ay bata."
      },
      {
        "id": "VOCAB-105",
        "word": "tayo",
        "meaning": "We (inclusive)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_03",
        "example": "Tayo'y magkaibigan."
      }
    ],
    "activities": [
      {
        "id": "EX-L03-001",
        "lesson": "Lesson_03",
        "type": "translation",
        "prompt": "Translate \"We (exclusive) are studying Tagalog.\"",
        "correctAnswer": "Kami ay nag-aaral ng Tagalog.` / `Nag-aaral ng Tagalog kami.",
        "acceptedAnswers": [
          "Kami ay nag-aaral ng Tagalog.",
          "Nag-aaral ng Tagalog kami."
        ],
        "explanation": "`Kami` is used because it excludes the listener."
      },
      {
        "id": "EX-L03-002",
        "lesson": "Lesson_03",
        "type": "translation",
        "prompt": "Translate \"You are intelligent\" using the post-predicate pronoun (*ka*).",
        "correctAnswer": "Marunong ka.",
        "acceptedAnswers": [
          "Marunong ka."
        ],
        "explanation": "When placing the pronoun after the predicate, `Ikaw` is shortened to `ka`."
      },
      {
        "id": "EX-L03-003",
        "lesson": "Lesson_03",
        "type": "translation",
        "prompt": "Translate \"Are you a teacher?\" using the polite form with *po*.",
        "correctAnswer": "Kayo po ba ay guro?",
        "acceptedAnswers": [
          "Kayo po ba ay guro?"
        ],
        "explanation": "The plural pronoun `kayo` with `po` expresses politeness when addressing a single person."
      },
      {
        "id": "EX-L03-004",
        "lesson": "Lesson_03",
        "type": "translation",
        "prompt": "Translate \"They are friends\" into Tagalog.",
        "correctAnswer": "Sila ay magkaibigan.` / `Magkaibigan sila.",
        "acceptedAnswers": [
          "Sila ay magkaibigan.",
          "Magkaibigan sila."
        ],
        "explanation": "`Sila` is the plural 3rd-person pronoun meaning \"they\"."
      },
      {
        "id": "EX-L03-005",
        "lesson": "Lesson_03",
        "type": "fill_in_blank",
        "prompt": "Combine the sentences: \"Kayo ay bumili ng pagkain\" (You plural bought food) + \"Ako ay bumili ng pagkain\" (I bought food) into one sentence.",
        "correctAnswer": "Tayo'y bumili ng pagkain.` / `Kami'y bumili ng pagkain.",
        "acceptedAnswers": [
          "Tayo'y bumili ng pagkain.",
          "Kami'y bumili ng pagkain."
        ],
        "explanation": "Combining \"You (plural) + I\" yields \"We\" (*Tayo* inclusive or *Kami* exclusive)."
      },
      {
        "id": "EX-L03-006",
        "lesson": "Lesson_03",
        "type": "translation",
        "prompt": "Translate \"We (inclusive) are clean and good.\"",
        "correctAnswer": "Tayo ay malilinis at mababait.` / `Malilinis at mababait tayo.",
        "acceptedAnswers": [
          "Tayo ay malilinis at mababait.",
          "Malilinis at mababait tayo."
        ],
        "explanation": "`Tayo` includes both the speaker and the listener."
      },
      {
        "id": "EX-L03-007",
        "lesson": "Lesson_03",
        "type": "translation",
        "prompt": "Translate \"She is playing\" into Tagalog using both word orders.",
        "correctAnswer": "Siya ay naglalaro.` / `Naglalaro siya.",
        "acceptedAnswers": [
          "Siya ay naglalaro.",
          "Naglalaro siya."
        ],
        "explanation": "`Siya` means he/she and `naglalaro` is the present tense of \"to play\"."
      },
      {
        "id": "EX-L03-008",
        "lesson": "Lesson_03",
        "type": "translation",
        "prompt": "Translate \"They are healthy and intelligent\" into Tagalog.",
        "correctAnswer": "Sila ay malulusog at marurunong.` / `Malulusog at marurunong sila.",
        "acceptedAnswers": [
          "Sila ay malulusog at marurunong.",
          "Malulusog at marurunong sila."
        ],
        "explanation": "Both adjectives take the plural form (duplicated first syllable) because the subject `sila` is plural."
      }
    ],
    "quiz": {
      "quiz_metadata": {
        "id": "LESSON_03_QUIZ",
        "lesson": "Lesson_03",
        "title": "Lesson 3 Mastery Exam",
        "topic": "Nominative Personal Pronouns & Politeness",
        "total_questions": 8,
        "created_at": "2026-08-22T13:00:00Z"
      },
      "questions": [
        {
          "id": "L03-Q01",
          "type": "multiple_choice",
          "topic": "Exclusive vs Inclusive We",
          "lesson": "Lesson_03",
          "prompt": "Which 1st person plural pronoun means 'we' EXCLUDING the listener (he/she and I, but NOT you)?",
          "options": [
            "kami",
            "tayo",
            "kayo",
            "sila"
          ],
          "correct_answer": "kami",
          "explanation": "'Kami' is the 1st person plural exclusive pronoun (excludes the person spoken to)."
        },
        {
          "id": "L03-Q02",
          "type": "multiple_choice",
          "topic": "Exclusive vs Inclusive We",
          "lesson": "Lesson_03",
          "prompt": "Which 1st person plural pronoun means 'we' INCLUDING the listener (you, he/she, and I)?",
          "options": [
            "tayo",
            "kami",
            "kayo",
            "sila"
          ],
          "correct_answer": "tayo",
          "explanation": "'Tayo' is the 1st person plural inclusive pronoun (includes the person spoken to)."
        },
        {
          "id": "L03-Q03",
          "type": "multiple_choice",
          "topic": "Ikaw vs Ka Usage",
          "lesson": "Lesson_03",
          "prompt": "Where is the 2nd person singular pronoun 'Ikaw' placed in a sentence?",
          "options": [
            "At the beginning of the sentence (before 'ay' or predicate)",
            "Immediately after the predicate in inverted order",
            "Only at the end of a question",
            "Interchangeably anywhere with 'ka'"
          ],
          "correct_answer": "At the beginning of the sentence (before 'ay' or predicate)",
          "explanation": "'Ikaw' is used at the beginning of sentences (e.g. Ikaw ay maganda). 'Ka' is used after the predicate (e.g. Maganda ka)."
        },
        {
          "id": "L03-Q04",
          "type": "fill_in_blank",
          "topic": "Ikaw vs Ka Usage",
          "lesson": "Lesson_03",
          "prompt": "In the inverted sentence 'Maganda ___' (You are beautiful), which 2nd person pronoun MUST be used after the predicate? ______",
          "correct_answer": "ka",
          "accepted_answers": [
            "ka",
            "Ka"
          ],
          "explanation": "'Ka' must follow the predicate in inverted order ('Maganda ka', NEVER 'Maganda ikaw')."
        },
        {
          "id": "L03-Q05",
          "type": "multiple_choice",
          "topic": "Gender-Neutral Pronoun",
          "lesson": "Lesson_03",
          "prompt": "What is the 3rd person singular nominative pronoun 'siya' used for in Tagalog?",
          "options": [
            "Both 'he' and 'she' (gender-neutral)",
            "Only 'he'",
            "Only 'she'",
            "Only non-human objects"
          ],
          "correct_answer": "Both 'he' and 'she' (gender-neutral)",
          "explanation": "'Siya' is gender-neutral and means both 'he' and 'she'."
        },
        {
          "id": "L03-Q06",
          "type": "multiple_choice",
          "topic": "Polite Address with Elders",
          "lesson": "Lesson_03",
          "prompt": "To address an elder or respected person politely, which plural pronoun is combined with 'po'?",
          "options": [
            "kayo",
            "kami",
            "tayo",
            "ako"
          ],
          "correct_answer": "kayo",
          "explanation": "Respectful communication uses plural pronouns 'kayo' or 'sila' with 'po' (e.g. Kayo po ba ay guro?)."
        },
        {
          "id": "L03-Q07",
          "type": "fill_in_blank",
          "topic": "Pronoun Contractions",
          "lesson": "Lesson_03",
          "prompt": "How does 'Sila ay' contract when 'ay' attaches to 'sila'? ______",
          "correct_answer": "Sila'y",
          "accepted_answers": [
            "Sila'y",
            "sila'y",
            "Silay",
            "silay"
          ],
          "explanation": "'Sila ay' contracts to 'Sila'y' because 'sila' ends in a vowel."
        },
        {
          "id": "L03-Q08",
          "type": "multiple_choice",
          "topic": "3rd Person Plural Pronoun",
          "lesson": "Lesson_03",
          "prompt": "Which pronoun means 'they' (3rd person plural)?",
          "options": [
            "sila",
            "kayo",
            "kami",
            "tayo"
          ],
          "correct_answer": "sila",
          "explanation": "'Sila' is the 3rd person plural pronoun meaning 'they'."
        }
      ]
    }
  },
  {
    "id": "LESSON_Lesson_04",
    "lessonKey": "Lesson_04",
    "title": "Lesson 4 — Demonstrative Pronouns & Ligatures",
    "summary": "Demonstrative pronouns (ito, iyan, iyon) across 3 distance perspectives and ligature connectors (-ng, -g, na).",
    "createdAt": "2026-08-21T00:00:00.000Z",
    "isDefault": true,
    "theory": [
      {
        "id": "THEORY-05",
        "topic": "Demonstrative Pronouns and Modifiers",
        "lesson": "Lesson_04",
        "summary": "Demonstrative pronouns point out objects based on distance from speaker and listener. They can also function as modifiers connected to nouns via ligatures.",
        "table": [
          {
            "pronoun": "ito",
            "meaning": "This (near speaker)",
            "plural": "ang mga ito (these)"
          },
          {
            "pronoun": "iyan",
            "meaning": "That (near listener)",
            "plural": "ang mga iyan (those)"
          },
          {
            "pronoun": "iyon",
            "meaning": "That over there (far from both)",
            "plural": "ang mga iyon (those over there)"
          }
        ]
      },
      {
        "id": "THEORY-06",
        "topic": "Connectives or Ligatures (-ng, -g, na)",
        "lesson": "Lesson_04",
        "summary": "Ligatures link adjacent words to show a modifying relationship. The suffix -ng is used after vowels, -g after the consonant 'n', and the word 'na' after other consonants. They connect adjective+noun, noun+noun, noun+verb, verb+adverb, and many other word-pair sequences.",
        "rules": [
          {
            "ligature": "-ng",
            "condition": "After words ending in vowels (a, e, i, o, u)",
            "example": "malaki + bahay -> malaking bahay (big house)"
          },
          {
            "ligature": "-g",
            "condition": "After words ending in consonant 'n'",
            "example": "mayaman + lalaki -> mayamang lalaki (rich man)"
          },
          {
            "ligature": "na",
            "condition": "Between words where the first ends in consonants other than 'n'",
            "example": "tahimik + bata -> tahimik na bata (quiet child)"
          },
          {
            "ligature": "-ng",
            "condition": "Adjective + Noun sequence",
            "example": "maganda + babae -> magandang babae (beautiful woman)"
          },
          {
            "ligature": "-ng",
            "condition": "Noun + Noun sequence",
            "example": "bata + babae -> batang babae (young girl)"
          },
          {
            "ligature": "-ng",
            "condition": "Noun + Verb / Verb + Noun sequence",
            "example": "bata + kumakain -> batang kumakain (child eating)"
          },
          {
            "ligature": "na",
            "condition": "Verb + Adjective / Adjective + Verb",
            "example": "pagod + dumating -> pagod na dumating (arrived tired)"
          },
          {
            "ligature": "-g",
            "condition": "Verb + Adverb / Adverb + Verb sequence",
            "example": "kumain + mabilis -> kumaing mabilis (ate quickly)"
          },
          {
            "ligature": "na",
            "condition": "Adjective + Adverb / Adverb + Adjective sequence",
            "example": "mabilis + masyado -> mabilis na masyado (too fast)"
          },
          {
            "ligature": "Exception",
            "condition": "Verb + Verb: Helping verb + main verb need NO ligature",
            "example": "ayaw + kumain -> ayaw kumain (does not want to eat)"
          },
          {
            "ligature": "-ng",
            "condition": "Pronoun + Noun / Noun + Pronoun",
            "example": "ito + mesa -> itong mesa (this table)"
          },
          {
            "ligature": "Exception",
            "condition": "Pronoun + Adjective: Adjective + nominative pronoun needs NO ligature",
            "example": "marunong + ka -> marunong ka (you are smart)"
          },
          {
            "ligature": "na",
            "condition": "Repeated adjective for superlative",
            "example": "mabait + mabait -> mabait na mabait (very kind)"
          },
          {
            "ligature": "Rule",
            "condition": "Multiple adjectives before a noun",
            "example": "Only the LAST adjective takes the ligature: mabait at masunuring aso"
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "id": "VOCAB-005",
        "word": "araw",
        "meaning": "Sun / Day",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Magandang araw."
      },
      {
        "id": "VOCAB-013",
        "word": "binata",
        "meaning": "Bachelor / Unmarried man",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Ang binata ay masipag."
      },
      {
        "id": "VOCAB-014",
        "word": "bintana",
        "meaning": "Window",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Nakabukas ang bintana."
      },
      {
        "id": "VOCAB-015",
        "word": "bulaklak",
        "meaning": "Flower",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Maganda ang bulaklak."
      },
      {
        "id": "VOCAB-016",
        "word": "bundok",
        "meaning": "Mountain",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Mataas ang bundok."
      },
      {
        "id": "VOCAB-017",
        "word": "dagat",
        "meaning": "Sea / Ocean",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Malaki ang dagat."
      },
      {
        "id": "VOCAB-018",
        "word": "dahon",
        "meaning": "Leaf",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Berde ang dahon."
      },
      {
        "id": "VOCAB-019",
        "word": "dalaga",
        "meaning": "Unmarried woman / Maiden",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Maganda ang dalaga."
      },
      {
        "id": "VOCAB-020",
        "word": "damit / baro",
        "meaning": "Clothes / Dress",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04, 05",
        "example": "Maganda ang damit."
      },
      {
        "id": "VOCAB-021",
        "word": "gabi",
        "meaning": "Night",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Gabing-gabi na."
      },
      {
        "id": "VOCAB-022",
        "word": "gamot",
        "meaning": "Medicine",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04, 05",
        "example": "Bumili ng gamot."
      },
      {
        "id": "VOCAB-023",
        "word": "gulay",
        "meaning": "Vegetable",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Masarap ang gulay."
      },
      {
        "id": "VOCAB-025",
        "word": "hangal",
        "meaning": "Fool",
        "partOfSpeech": "Noun / Adjective",
        "lesson": "Lesson_04",
        "example": "Ang hangal na ito ay umiyak."
      },
      {
        "id": "VOCAB-027",
        "word": "ibon",
        "meaning": "Bird",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Lumilipad ang ibon."
      },
      {
        "id": "VOCAB-029",
        "word": "inapi",
        "meaning": "Maltreated",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Tayong kanilang inapi ay natuto."
      },
      {
        "id": "VOCAB-031",
        "word": "isda",
        "meaning": "Fish",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Masarap ang isda."
      },
      {
        "id": "VOCAB-032",
        "word": "ito",
        "meaning": "This",
        "partOfSpeech": "Demonstrative",
        "lesson": "Lesson_04",
        "example": "Ito'y pagkain."
      },
      {
        "id": "VOCAB-033",
        "word": "iyan",
        "meaning": "That (near listener)",
        "partOfSpeech": "Demonstrative",
        "lesson": "Lesson_04",
        "example": "Iyan ay pagkain."
      },
      {
        "id": "VOCAB-034",
        "word": "iyon",
        "meaning": "That over there (far)",
        "partOfSpeech": "Demonstrative",
        "lesson": "Lesson_04",
        "example": "Iyon ay ilog."
      },
      {
        "id": "VOCAB-042",
        "word": "lamok",
        "meaning": "Mosquito",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Maliit ang lamok."
      },
      {
        "id": "VOCAB-043",
        "word": "langit",
        "meaning": "Sky",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04",
        "example": "Bughaw ang langit."
      },
      {
        "id": "VOCAB-050",
        "word": "mabilis",
        "meaning": "Fast",
        "partOfSpeech": "Adjective / Adverb",
        "lesson": "Lesson_04",
        "example": "Kumaing mabilis si Pablo."
      },
      {
        "id": "VOCAB-052",
        "word": "madilim",
        "meaning": "Dark",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Madilim ang gabi."
      },
      {
        "id": "VOCAB-056",
        "word": "mahal",
        "meaning": "Expensive / Beloved",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Mahal ang relo."
      },
      {
        "id": "VOCAB-058",
        "word": "mahusay",
        "meaning": "Efficient",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Mahusay ang guro."
      },
      {
        "id": "VOCAB-059",
        "word": "maingay",
        "meaning": "Noisy",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_03, 04",
        "example": "Maingay kayo."
      },
      {
        "id": "VOCAB-060",
        "word": "mainit",
        "meaning": "Hot",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Mainit ang kape."
      },
      {
        "id": "VOCAB-061",
        "word": "maitim",
        "meaning": "Black",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Maitim ang aso."
      },
      {
        "id": "VOCAB-064",
        "word": "malinaw",
        "meaning": "Clear",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Malinaw ang tubig."
      },
      {
        "id": "VOCAB-066",
        "word": "maliit",
        "meaning": "Small",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Maliit ito."
      },
      {
        "id": "VOCAB-068",
        "word": "mapagbigay",
        "meaning": "Generous",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Ang mayamang lalaki ay mapagbigay."
      },
      {
        "id": "VOCAB-069",
        "word": "maputi",
        "meaning": "Whitish / Fair-skinned",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Maputi ang babae."
      },
      {
        "id": "VOCAB-070",
        "word": "marami",
        "meaning": "Plenty / Many",
        "partOfSpeech": "Adjective / Adverb",
        "lesson": "Lesson_03, 04",
        "example": "Marami iyan."
      },
      {
        "id": "VOCAB-072",
        "word": "marumi",
        "meaning": "Dirty",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04, 05",
        "example": "Marumi ang baro."
      },
      {
        "id": "VOCAB-073",
        "word": "maasim",
        "meaning": "Sour",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Maasim na mangga."
      },
      {
        "id": "VOCAB-077",
        "word": "mataba",
        "meaning": "Fat",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 04",
        "example": "Mataba ang aso."
      },
      {
        "id": "VOCAB-078",
        "word": "matamis",
        "meaning": "Sweet (food)",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Matamis ang prutas."
      },
      {
        "id": "VOCAB-081",
        "word": "matapang",
        "meaning": "Brave",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Matapang ang sundalo."
      },
      {
        "id": "VOCAB-082",
        "word": "mayaman",
        "meaning": "Rich / Wealthy",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Ang mayamang lalaki."
      },
      {
        "id": "VOCAB-083",
        "word": "mesa / lamesa",
        "meaning": "Table",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Malinis ang mesa."
      },
      {
        "id": "VOCAB-090",
        "word": "pagkain",
        "meaning": "Food",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04, 05",
        "example": "Masarap ang pagkain."
      },
      {
        "id": "VOCAB-091",
        "word": "pagod",
        "meaning": "Tired",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Pagod na dumating si tatay."
      },
      {
        "id": "VOCAB-094",
        "word": "payat",
        "meaning": "Thin",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Payat ang bata."
      },
      {
        "id": "VOCAB-098",
        "word": "sariwa",
        "meaning": "Fresh",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Sariwa ang gulay."
      },
      {
        "id": "VOCAB-103",
        "word": "tahimik",
        "meaning": "Quiet",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Tahimik na bata."
      },
      {
        "id": "VOCAB-104",
        "word": "tamad",
        "meaning": "Lazy",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04",
        "example": "Tamad ang lalaki."
      },
      {
        "id": "VOCAB-106",
        "word": "tubig",
        "meaning": "Water",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04",
        "example": "Mainit ang tubig."
      }
    ],
    "activities": [
      {
        "id": "EX-L04-001",
        "lesson": "Lesson_04",
        "type": "fill_in_blank",
        "prompt": "Apply the correct ligature to combine `mayaman` (rich) + `lalaki` (man).",
        "correctAnswer": "mayamang lalaki` / `lalaking mayaman",
        "acceptedAnswers": [
          "mayamang lalaki",
          "lalaking mayaman"
        ],
        "explanation": "Since `mayaman` ends in the consonant **N**, the suffix ligature `-g` is attached, producing `mayamang`."
      },
      {
        "id": "EX-L04-002",
        "lesson": "Lesson_04",
        "type": "fill_in_blank",
        "prompt": "Apply the correct ligature to combine `malinis` (clean) + `pagkain` (food).",
        "correctAnswer": "malinis na pagkain` / `pagkaing malinis",
        "acceptedAnswers": [
          "malinis na pagkain",
          "pagkaing malinis"
        ],
        "explanation": "`Malinis` ends in the consonant **s** (not **n**), so the ligature word `na` is used between the two words."
      },
      {
        "id": "EX-L04-003",
        "lesson": "Lesson_04",
        "type": "fill_in_blank",
        "prompt": "Apply the correct ligature to combine `marumi` (dirty) + `sapatos` (shoes).",
        "correctAnswer": "maruming sapatos` / `sapatos na marumi",
        "acceptedAnswers": [
          "maruming sapatos",
          "sapatos na marumi"
        ],
        "explanation": "`Marumi` ends in a vowel (**i**), so the suffix `-ng` is attached."
      },
      {
        "id": "EX-L04-004",
        "lesson": "Lesson_04",
        "type": "fill_in_blank",
        "prompt": "Point to the desk in front of you (close to the speaker): `_____ ang aking lamesa.`",
        "correctAnswer": "Ito` / `Ito'y",
        "acceptedAnswers": [
          "Ito",
          "Ito'y"
        ],
        "explanation": "`Ito` is used for objects near the speaker."
      },
      {
        "id": "EX-L04-005",
        "lesson": "Lesson_04",
        "type": "fill_in_blank",
        "prompt": "Apply the correct ligature to combine `malakas` (strong) + `batang lalaki` (boy).",
        "correctAnswer": "malakas na batang lalaki` / `batang lalaking malakas",
        "acceptedAnswers": [
          "malakas na batang lalaki",
          "batang lalaking malakas"
        ],
        "explanation": "`Malakas` ends in consonant **s** (not **n**), so `na` is used."
      },
      {
        "id": "EX-L04-006",
        "lesson": "Lesson_04",
        "type": "fill_in_blank",
        "prompt": "Apply the correct ligature to combine `mataba` (fat) + `aso` (dog).",
        "correctAnswer": "matabang aso` / `asong mataba",
        "acceptedAnswers": [
          "matabang aso",
          "asong mataba"
        ],
        "explanation": "`Mataba` ends in vowel **a**, so the suffix `-ng` is attached."
      }
    ],
    "quiz": {
      "quiz_metadata": {
        "id": "LESSON_04_QUIZ",
        "lesson": "Lesson_04",
        "title": "Lesson 4 Mastery Exam",
        "topic": "Demonstrative Pronouns & Connectives / Ligatures (-ng, -g, na)",
        "total_questions": 8,
        "created_at": "2026-08-22T13:00:00Z"
      },
      "questions": [
        {
          "id": "L04-Q01",
          "type": "multiple_choice",
          "topic": "Demonstrative Distance",
          "lesson": "Lesson_04",
          "prompt": "Which demonstrative pronoun means 'this' (object close to the speaker)?",
          "options": [
            "ito",
            "iyan",
            "iyon",
            "dito"
          ],
          "correct_answer": "ito",
          "explanation": "'Ito' means 'this' (near speaker)."
        },
        {
          "id": "L04-Q02",
          "type": "multiple_choice",
          "topic": "Demonstrative Distance",
          "lesson": "Lesson_04",
          "prompt": "Which demonstrative pronoun means 'that' (object near the listener)?",
          "options": [
            "iyan",
            "ito",
            "iyon",
            "doon"
          ],
          "correct_answer": "iyan",
          "explanation": "'Iyan' means 'that' (near listener)."
        },
        {
          "id": "L04-Q03",
          "type": "multiple_choice",
          "topic": "Demonstrative Distance",
          "lesson": "Lesson_04",
          "prompt": "Which demonstrative pronoun means 'that over there' (far from both speaker and listener)?",
          "options": [
            "iyon",
            "ito",
            "iyan",
            "diyan"
          ],
          "correct_answer": "iyon",
          "explanation": "'Iyon' means 'that over there' (far from both)."
        },
        {
          "id": "L04-Q04",
          "type": "multiple_choice",
          "topic": "Ligatures after Vowels",
          "lesson": "Lesson_04",
          "prompt": "When a word ends in a vowel (e.g. 'malaki'), which ligature is attached directly to the end of the word before a noun?",
          "options": [
            "-ng",
            "na",
            "-g",
            "nang"
          ],
          "correct_answer": "-ng",
          "explanation": "If a modifying word ends in a vowel, '-ng' is attached directly: malaki + -ng = malaking bahay."
        },
        {
          "id": "L04-Q05",
          "type": "multiple_choice",
          "topic": "Ligatures after Consonants",
          "lesson": "Lesson_04",
          "prompt": "When a word ends in a consonant OTHER than 'n' (e.g. 'tahimik'), which standalone ligature is placed between the words?",
          "options": [
            "na",
            "-ng",
            "-g",
            "nang"
          ],
          "correct_answer": "na",
          "explanation": "If a modifying word ends in a consonant other than 'n', 'na' is placed as a separate word: tahimik na bata."
        },
        {
          "id": "L04-Q06",
          "type": "fill_in_blank",
          "topic": "Ligature for letter N",
          "lesson": "Lesson_04",
          "prompt": "When connecting 'mayaman' + 'lalaki', the consonant 'n' changes to '-g'. What is the correct linked form? ______ lalaki",
          "correct_answer": "mayamang",
          "accepted_answers": [
            "mayamang",
            "Mayamang"
          ],
          "explanation": "When a word ends in consonant 'n', '-g' is added: mayaman + -g = mayamang lalaki."
        },
        {
          "id": "L04-Q07",
          "type": "multiple_choice",
          "topic": "Demonstrative Modifiers",
          "lesson": "Lesson_04",
          "prompt": "How do you say 'this table' using the demonstrative 'ito' and ligature '-ng'?",
          "options": [
            "itong mesa",
            "ito na mesa",
            "ito mesa",
            "mga itong mesa"
          ],
          "correct_answer": "itong mesa",
          "explanation": "Demonstrative + ligature '-ng': ito + -ng = itong mesa (or mesang ito)."
        },
        {
          "id": "L04-Q08",
          "type": "multiple_choice",
          "topic": "Ligature Exceptions",
          "lesson": "Lesson_04",
          "prompt": "In helping verb + main verb constructions (e.g. 'ayaw' + 'kumain'), which ligature rule applies?",
          "options": [
            "NO ligature is used between helping verb and main verb (ayaw kumain)",
            "Must always use '-ng'",
            "Must always use 'na'",
            "Must duplicate the verb"
          ],
          "correct_answer": "NO ligature is used between helping verb and main verb (ayaw kumain)",
          "explanation": "Helping verbs followed by main verbs require NO ligature: 'ayaw kumain' (does not want to eat)."
        }
      ]
    }
  },
  {
    "id": "LESSON_Lesson_05",
    "lessonKey": "Lesson_05",
    "title": "Lesson 5 — Possessive Markers & Pronouns",
    "summary": "Possessive markers (ni, nina, ng, ng mga) and possessive pronouns in pre-noun (akin, iyo, kaniya) and post-noun (ko, mo, niya) forms.",
    "createdAt": "2026-08-21T00:00:00.000Z",
    "isDefault": true,
    "theory": [
      {
        "id": "THEORY-07",
        "topic": "Possessive Words and Pronouns",
        "lesson": "Lesson_05",
        "summary": "Possession is indicated by 'ni' (before proper nouns) and 'ng' (before common nouns). Possessive pronouns have two forms: pre-noun (with ligature) and post-noun. The possessed object ALWAYS comes before the owner in Tagalog.",
        "rules": [
          {
            "type": "Proper Noun Possessive",
            "singular": "ni Maria",
            "plural": "nina Maria at Pedro"
          },
          {
            "type": "Common Noun Possessive",
            "singular": "ng lalaki",
            "plural": "ng mga bata"
          },
          {
            "type": "Possessive Word Order",
            "description": "The possessed object ALWAYS precedes the owner (e.g. ang bahay ni Maria — Maria's house)."
          },
          {
            "type": "Pre-Noun vs Post-Noun Possessive Pronouns",
            "pairs": [
              {
                "pre": "akin",
                "post": "ko",
                "meaning": "my / mine"
              },
              {
                "pre": "iyo",
                "post": "mo",
                "meaning": "your / yours"
              },
              {
                "pre": "kaniya / kanya",
                "post": "niya",
                "meaning": "his / her / hers"
              },
              {
                "pre": "amin",
                "post": "namin",
                "meaning": "our / ours (exclusive)"
              },
              {
                "pre": "atin",
                "post": "natin",
                "meaning": "our / ours (inclusive)"
              },
              {
                "pre": "inyo",
                "post": "ninyo",
                "meaning": "your / yours (plural)"
              },
              {
                "pre": "kanila",
                "post": "nila",
                "meaning": "their / theirs"
              }
            ]
          },
          {
            "type": "Demonstrative Possessives",
            "forms": [
              {
                "word": "nito",
                "meaning": "of this person (near speaker)",
                "example": "ang bahay nito"
              },
              {
                "word": "niyan",
                "meaning": "of that person (near listener)",
                "example": "ang bahay niyan"
              },
              {
                "word": "niyon",
                "meaning": "of that person (far from both)",
                "example": "ang bahay niyon"
              }
            ]
          },
          {
            "type": "Plural possessive forms",
            "description": "Plural possessives: 'ng mga ito', 'ng mga iyan', 'ng mga iyon' (of these/those people)."
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "id": "VOCAB-003",
        "word": "amin",
        "meaning": "Our (exclusive)",
        "partOfSpeech": "Possessive Pronoun",
        "lesson": "Lesson_05",
        "example": "Ang aming kotse."
      },
      {
        "id": "VOCAB-007",
        "word": "atin",
        "meaning": "Our (inclusive)",
        "partOfSpeech": "Possessive Pronoun",
        "lesson": "Lesson_05",
        "example": "Ang ating bahay."
      },
      {
        "id": "VOCAB-009",
        "word": "bago",
        "meaning": "New",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 05",
        "example": "Ang baro mo ay bago."
      },
      {
        "id": "VOCAB-010",
        "word": "bahay",
        "meaning": "House",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Malaki ang bahay."
      },
      {
        "id": "VOCAB-020",
        "word": "damit / baro",
        "meaning": "Clothes / Dress",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04, 05",
        "example": "Maganda ang damit."
      },
      {
        "id": "VOCAB-022",
        "word": "gamot",
        "meaning": "Medicine",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_04, 05",
        "example": "Bumili ng gamot."
      },
      {
        "id": "VOCAB-024",
        "word": "guro",
        "meaning": "Teacher",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_03, 05",
        "example": "Kayo po ba ay guro?"
      },
      {
        "id": "VOCAB-030",
        "word": "inyo",
        "meaning": "Your (plural)",
        "partOfSpeech": "Possessive Pronoun",
        "lesson": "Lesson_05",
        "example": "Ang inyong ama."
      },
      {
        "id": "VOCAB-036",
        "word": "kaniya / kanya",
        "meaning": "His / Her",
        "partOfSpeech": "Possessive Pronoun",
        "lesson": "Lesson_05",
        "example": "Kanyang sapatos."
      },
      {
        "id": "VOCAB-037",
        "word": "kanila",
        "meaning": "Their / Theirs",
        "partOfSpeech": "Possessive Pronoun",
        "lesson": "Lesson_05",
        "example": "Kanilang lapis."
      },
      {
        "id": "VOCAB-040",
        "word": "kotse",
        "meaning": "Car",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Luma ang kotse."
      },
      {
        "id": "VOCAB-044",
        "word": "lapis",
        "meaning": "Pencil",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Ang lapis ni Helen."
      },
      {
        "id": "VOCAB-045",
        "word": "luma",
        "meaning": "Old (for inanimate objects)",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 05",
        "example": "Luma ang kotse."
      },
      {
        "id": "VOCAB-062",
        "word": "malamig",
        "meaning": "Cold",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_02, 05",
        "example": "Malamig ang tubig."
      },
      {
        "id": "VOCAB-072",
        "word": "marumi",
        "meaning": "Dirty",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_04, 05",
        "example": "Marumi ang baro."
      },
      {
        "id": "VOCAB-089",
        "word": "paaralan",
        "meaning": "School",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Ang paaralan ay malaki."
      },
      {
        "id": "VOCAB-090",
        "word": "pagkain",
        "meaning": "Food",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 04, 05",
        "example": "Masarap ang pagkain."
      },
      {
        "id": "VOCAB-096",
        "word": "sanggol",
        "meaning": "Baby",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_05",
        "example": "Ang baro ng sanggol."
      },
      {
        "id": "VOCAB-097",
        "word": "sapatos",
        "meaning": "Shoes",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_02, 05",
        "example": "Malilinis ang sapatos."
      }
    ],
    "activities": [
      {
        "id": "EX-L05-001",
        "lesson": "Lesson_05",
        "type": "translation",
        "prompt": "Translate \"Peter's book is clean\" into direct word order.",
        "correctAnswer": "Ang aklat ni Peter ay malinis.",
        "acceptedAnswers": [
          "Ang aklat ni Peter ay malinis."
        ],
        "explanation": "The possessed object (*ang aklat*) comes first, followed by the proper possessive marker *ni* and the name *Peter*."
      },
      {
        "id": "EX-L05-002",
        "lesson": "Lesson_05",
        "type": "translation",
        "prompt": "Rewrite the sentence `Ang aking bahay ay malaki` using a post-noun possessive pronoun.",
        "correctAnswer": "Ang bahay ko ay malaki.",
        "acceptedAnswers": [
          "Ang bahay ko ay malaki."
        ],
        "explanation": "The pre-noun possessive pronoun `aking` changes to `ko` when placed after the noun."
      },
      {
        "id": "EX-L05-003",
        "lesson": "Lesson_05",
        "type": "fill_in_blank",
        "prompt": "Complete the sentence for \"The dog of this person (near speaker) is intelligent\": `Ang aso ____ ay marunong.`",
        "correctAnswer": "nito",
        "acceptedAnswers": [
          "nito"
        ],
        "explanation": "`Nito` is the possessive form of the demonstrative `ito` (of this)."
      },
      {
        "id": "EX-L05-004",
        "lesson": "Lesson_05",
        "type": "translation",
        "prompt": "Translate \"The man's shoes are new\" into Tagalog.",
        "correctAnswer": "Ang sapatos ng lalaki ay bago.` / `Bago ang sapatos ng lalaki.",
        "acceptedAnswers": [
          "Ang sapatos ng lalaki ay bago.",
          "Bago ang sapatos ng lalaki."
        ],
        "explanation": "`Ng lalaki` is the possessive form for a common noun (the man). The possessed object (*ang sapatos*) comes before the owner."
      },
      {
        "id": "EX-L05-005",
        "lesson": "Lesson_05",
        "type": "translation",
        "prompt": "Translate \"Their house is big\" into Tagalog.",
        "correctAnswer": "Ang kanilang bahay ay malaki.` / `Ang bahay nila ay malaki.` / `Malaki ang bahay nila.",
        "acceptedAnswers": [
          "Ang kanilang bahay ay malaki.",
          "Ang bahay nila ay malaki.",
          "Malaki ang bahay nila."
        ],
        "explanation": "`Kanilang` is the pre-noun form and `nila` is the post-noun form of the 3rd person plural possessive."
      },
      {
        "id": "EX-L05-006",
        "lesson": "Lesson_05",
        "type": "translation",
        "prompt": "Translate \"My food is delicious\" into Tagalog.",
        "correctAnswer": "Ang aking pagkain ay masarap.` / `Ang pagkain ko ay masarap.` / `Masarap ang pagkain ko.",
        "acceptedAnswers": [
          "Ang aking pagkain ay masarap.",
          "Ang pagkain ko ay masarap.",
          "Masarap ang pagkain ko."
        ],
        "explanation": "`Aking` (pre-noun) or `ko` (post-noun) are the first person singular possessive forms."
      }
    ],
    "quiz": {
      "quiz_metadata": {
        "id": "LESSON_05_QUIZ",
        "lesson": "Lesson_05",
        "title": "Lesson 5 Mastery Exam",
        "topic": "Possessive Noun Markers & Possessive Pronouns",
        "total_questions": 8,
        "created_at": "2026-08-22T13:00:00Z"
      },
      "questions": [
        {
          "id": "L05-Q01",
          "type": "multiple_choice",
          "topic": "Possessive Proper Noun Marker",
          "lesson": "Lesson_05",
          "prompt": "Which possessive marker indicates singular proper noun ownership (e.g. 'Maria's house')?",
          "options": [
            "ni Maria",
            "ng Maria",
            "si Maria",
            "sa Maria"
          ],
          "correct_answer": "ni Maria",
          "explanation": "'Ni' is the singular proper noun possessive marker (e.g. ang bahay ni Maria = Maria's house)."
        },
        {
          "id": "L05-Q02",
          "type": "multiple_choice",
          "topic": "Possessive Common Noun Marker",
          "lesson": "Lesson_05",
          "prompt": "Which possessive marker indicates common noun ownership (e.g. 'the child's toy')?",
          "options": [
            "ng",
            "ni",
            "ang",
            "sa"
          ],
          "correct_answer": "ng",
          "explanation": "'Ng' is the common noun possessive marker (e.g. ang laruan ng bata = the child's toy)."
        },
        {
          "id": "L05-Q03",
          "type": "multiple_choice",
          "topic": "Possessive Word Order Rule",
          "lesson": "Lesson_05",
          "prompt": "In Tagalog possessive phrases, which element comes FIRST in sentence order?",
          "options": [
            "The possessed object (e.g. ang bahay ni Maria)",
            "The owner of the object (e.g. ni Maria ang bahay)",
            "The possessive adjective",
            "The verb"
          ],
          "correct_answer": "The possessed object (e.g. ang bahay ni Maria)",
          "explanation": "In Tagalog possessive constructions, the possessed object ALWAYS precedes the owner: 'ang bahay ni Maria' (the house of Maria)."
        },
        {
          "id": "L05-Q04",
          "type": "multiple_choice",
          "topic": "Pre-Noun vs Post-Noun 1st Person",
          "lesson": "Lesson_05",
          "prompt": "Which pair represents the 1st person singular 'my / mine' in Pre-Noun (with ligature) vs Post-Noun form?",
          "options": [
            "Akin (Pre-noun) / Ko (Post-noun)",
            "Iyo (Pre-noun) / Mo (Post-noun)",
            "Kanya (Pre-noun) / Niya (Post-noun)",
            "Atin (Pre-noun) / Natin (Post-noun)"
          ],
          "correct_answer": "Akin (Pre-noun) / Ko (Post-noun)",
          "explanation": "'Akin' is used pre-noun (e.g. aking bahay), while 'ko' is used post-noun (e.g. bahay ko)."
        },
        {
          "id": "L05-Q05",
          "type": "fill_in_blank",
          "topic": "Post-Noun Possessive Pronoun",
          "lesson": "Lesson_05",
          "prompt": "Translate 'your book' using the post-noun possessive pronoun: 'libro ___'. ______",
          "correct_answer": "mo",
          "accepted_answers": [
            "mo",
            "Mo"
          ],
          "explanation": "'Mo' is the 2nd person singular post-noun possessive pronoun ('libro mo' = your book)."
        },
        {
          "id": "L05-Q06",
          "type": "multiple_choice",
          "topic": "3rd Person Post-Noun Possessive",
          "lesson": "Lesson_05",
          "prompt": "Which post-noun possessive pronoun means 'his' / 'her' / 'hers' (e.g. 'ang bahay ___')?",
          "options": [
            "niya",
            "ko",
            "mo",
            "nila"
          ],
          "correct_answer": "niya",
          "explanation": "'Niya' is the 3rd person singular post-noun possessive pronoun ('his/her')."
        },
        {
          "id": "L05-Q07",
          "type": "multiple_choice",
          "topic": "Demonstrative Possessives",
          "lesson": "Lesson_05",
          "prompt": "Which demonstrative possessive word means 'of this person / object' (near speaker)?",
          "options": [
            "nito",
            "niyan",
            "niyon",
            "ito"
          ],
          "correct_answer": "nito",
          "explanation": "'Nito' means 'of this' (near speaker, e.g. ang bahay nito)."
        },
        {
          "id": "L05-Q08",
          "type": "fill_in_blank",
          "topic": "Plural Proper Noun Possessive Marker",
          "lesson": "Lesson_05",
          "prompt": "Which possessive marker is used before multiple proper names of people ('___ Maria at Pedro')? ______",
          "correct_answer": "nina",
          "accepted_answers": [
            "nina",
            "Nina"
          ],
          "explanation": "'Nina' is the plural proper noun possessive marker (e.g. ang bahay nina Maria at Pedro)."
        }
      ]
    }
  },
  {
    "id": "LESSON_Lesson_06",
    "lessonKey": "Lesson_06",
    "title": "Lesson 6 — Question Words & Interrogatives",
    "summary": "Core interrogative question words (Sino, Ano, Saan/Nasaan, Kailan, Bakit, Paano, Ilan/Magkano), pluralization, and contractions.",
    "createdAt": "2026-08-21T00:00:00.000Z",
    "isDefault": true,
    "theory": [
      {
        "id": "THEORY-09",
        "topic": "Question Words (Interrogative Pronouns & Adverbs)",
        "lesson": "Lesson_06",
        "summary": "Tagalog uses 12 main interrogative words corresponding to who, what, which, how, why, when, where, how many, how much, and whose. Question words appear at the start of sentences.",
        "table": [
          {
            "pronoun": "Sino",
            "meaning": "Who",
            "type": "Interrogative Pronoun (person)",
            "contraction": "Sino'y",
            "usage": "Sino ba kayo? (Who are you?)"
          },
          {
            "pronoun": "Ano",
            "meaning": "What",
            "type": "Interrogative Pronoun (things/ideas)",
            "contraction": "Ano'y",
            "usage": "Ano ito? (What is this?)"
          },
          {
            "pronoun": "Alin",
            "meaning": "Which",
            "type": "Interrogative Pronoun (selection)",
            "usage": "Alin ba ang iyong gusto? (Which do you like?)"
          },
          {
            "pronoun": "Gaano",
            "meaning": "How (extent/degree)",
            "type": "Interrogative Adverb (degree)",
            "usage": "Gaano katagal? (How long? Requires ka- + adjective)"
          },
          {
            "pronoun": "Paano",
            "meaning": "How (manner/method)",
            "type": "Interrogative Adverb (method)",
            "usage": "Paano ka natutong magluto? (How did you learn to cook?)"
          },
          {
            "pronoun": "Bakit",
            "meaning": "Why",
            "type": "Interrogative Adverb (reason)",
            "usage": "Bakit siya galit? (Why is he/she angry?)"
          },
          {
            "pronoun": "Kailan",
            "meaning": "When",
            "type": "Interrogative Adverb (time)",
            "usage": "Kailan kayo dumating? (When did you arrive?)"
          },
          {
            "pronoun": "Nasaan",
            "meaning": "Where is/are",
            "type": "Interrogative Adverb (location of specific item/person)",
            "usage": "Nasaan ang susi? (Where is the key? Followed by specific noun)"
          },
          {
            "pronoun": "Saan",
            "meaning": "Where",
            "type": "Interrogative Adverb (direction/general location)",
            "usage": "Saan kayo nakatira? (Where do you live?)"
          },
          {
            "pronoun": "Ilan",
            "meaning": "How many",
            "type": "Interrogative Pronoun/Adjective (count)",
            "usage": "Ilan ang anak ninyo? (How many children do you have?)"
          },
          {
            "pronoun": "Magkano",
            "meaning": "How much",
            "type": "Interrogative Word (price/cost)",
            "usage": "Magkano ang aklat? (How much is the book?)"
          },
          {
            "pronoun": "Kanino",
            "meaning": "Whose / To whom",
            "type": "Interrogative Pronoun (possession)",
            "usage": "Kanino ang bahay na iyan? (Whose house is that?)"
          }
        ]
      },
      {
        "id": "THEORY-10",
        "topic": "Pluralization of Question Words",
        "lesson": "Lesson_06",
        "summary": "Plural forms of question words are created by duplicating the whole word (for 2-syllable words) or the first two syllables (for 3+ syllable words) when referring to multiple items or expecting a plural response. Note: nasaan and bakit are never duplicated.",
        "table": [
          {
            "pronoun": "sinu-sino",
            "meaning": "Who (plural)",
            "type": "2-syllable duplication (o -> u)",
            "usage": "Sinu-sino ang inyong mga anak? (Which of the children are yours?)"
          },
          {
            "pronoun": "anu-ano",
            "meaning": "What (plural)",
            "type": "2-syllable duplication (o -> u)",
            "usage": "Anu-ano ang mga pangalan ninyo? (What are your names?)"
          },
          {
            "pronoun": "alin-alin",
            "meaning": "Which (plural)",
            "type": "2-syllable duplication",
            "usage": "Alin-alin ang mga aklat mo? (Which ones are your books?)"
          },
          {
            "pronoun": "saan-saan",
            "meaning": "Where (plural locations)",
            "type": "2-syllable duplication",
            "usage": "Saan-saan kayo nakatira? (Where do you all live?)"
          },
          {
            "pronoun": "ilan-ilan",
            "meaning": "How many (each/per group)",
            "type": "2-syllable duplication",
            "usage": "Ilan-ilan ang mga anak nila? (How many children do they each have?)"
          },
          {
            "pronoun": "kani-kanino",
            "meaning": "Whose (plural items/owners)",
            "type": "3+ syllable first 2 syllable duplication",
            "usage": "Kani-kanino ang mga bahay na iyan? (Whose houses are those?)"
          },
          {
            "pronoun": "magka-magkano",
            "meaning": "How much each",
            "type": "3+ syllable first 2 syllable duplication",
            "usage": "Magka-magkano ang mga aklat? (How much are each of the books?)"
          }
        ],
        "rules": [
          {
            "rule": "2-syllable words",
            "condition": "Duplicate whole word",
            "example": "alin -> alin-alin, sino -> sinu-sino"
          },
          {
            "rule": "3+ syllable words",
            "condition": "Duplicate first two syllables",
            "example": "kanino -> kani-kanino, magkano -> magka-magkano"
          },
          {
            "rule": "Vowel shift 'o' -> 'u'",
            "condition": "Last syllable 'o' changes to 'u' in duplicated prefix",
            "example": "ano -> anu-ano, sino -> sinu-sino"
          },
          {
            "rule": "Exceptions",
            "condition": "nasaan & bakit are NEVER duplicated",
            "example": "Nothing can be in two places at once; no duplicate explanations"
          }
        ]
      },
      {
        "id": "THEORY-11",
        "topic": "Contracted Questions and Common Everyday Phrases",
        "lesson": "Lesson_06",
        "summary": "In spoken Tagalog, question words frequently combine with ligatures (-ng) and demonstratives (ito -> 'to, iyan -> 'yan) to create natural contracted questions.",
        "rules": [
          {
            "type": "Contracted Sino",
            "example_tagalog": "Sinong tao 'yan?",
            "example_english": "Who is that person?"
          },
          {
            "type": "Contracted Kanino",
            "example_tagalog": "Kanino 'to?",
            "example_english": "Whose is this?"
          },
          {
            "type": "Contracted Ano",
            "example_tagalog": "Ano 'yan?",
            "example_english": "What's that?"
          },
          {
            "type": "Everyday Question: Do you know?",
            "example_tagalog": "Kilala mo ba siya?",
            "example_english": "Do you know her/him?"
          },
          {
            "type": "Everyday Question: Are you coming?",
            "example_tagalog": "Sasama ka ba?",
            "example_english": "Are you coming along?"
          },
          {
            "type": "Everyday Question: Going home?",
            "example_tagalog": "Uuwi ka na ba?",
            "example_english": "Are you going home already?"
          },
          {
            "type": "Everyday Question: Correct?",
            "example_tagalog": "Tama ba ito?",
            "example_english": "Is this correct?"
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "id": "VOCAB-107",
        "word": "aalis",
        "meaning": "Is/are leaving",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_06, 07",
        "example": "Kailan kayo aalis?"
      },
      {
        "id": "VOCAB-108",
        "word": "alin",
        "meaning": "Which",
        "partOfSpeech": "Pronoun / Interrogative",
        "lesson": "Lesson_06",
        "example": "Alin ba ang iyong gusto?"
      },
      {
        "id": "VOCAB-109",
        "word": "alin-alin",
        "meaning": "Which (plural)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_06",
        "example": "Alin-alin ang mga aklat mo?"
      },
      {
        "id": "VOCAB-110",
        "word": "ano",
        "meaning": "What",
        "partOfSpeech": "Pronoun / Interrogative",
        "lesson": "Lesson_06",
        "example": "Ano ito?"
      },
      {
        "id": "VOCAB-111",
        "word": "anu-ano",
        "meaning": "What (plural)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_06",
        "example": "Anu-ano ang mga pangalan ninyo?"
      },
      {
        "id": "VOCAB-112",
        "word": "bakal",
        "meaning": "Iron (metal)",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Alin ang mas mabigat: bakal o tingga?"
      },
      {
        "id": "VOCAB-113",
        "word": "bakit",
        "meaning": "Why",
        "partOfSpeech": "Adverb / Interrogative",
        "lesson": "Lesson_06",
        "example": "Bakit siya galit?"
      },
      {
        "id": "VOCAB-114",
        "word": "dumating",
        "meaning": "Arrived",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_06",
        "example": "Kailan kayo dumating sa Pilipinas?"
      },
      {
        "id": "VOCAB-115",
        "word": "gaano",
        "meaning": "How (extent / degree)",
        "partOfSpeech": "Adverb / Interrogative",
        "lesson": "Lesson_06",
        "example": "Gaano kalaki ang bahay mo?"
      },
      {
        "id": "VOCAB-116",
        "word": "galit",
        "meaning": "Angry",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_06",
        "example": "Bakit siya galit?"
      },
      {
        "id": "VOCAB-117",
        "word": "gusto",
        "meaning": "To like / Want",
        "partOfSpeech": "Pseudo-verb / Verb",
        "lesson": "Lesson_06, 07",
        "example": "Anong gusto mo?"
      },
      {
        "id": "VOCAB-118",
        "word": "ilan",
        "meaning": "How many",
        "partOfSpeech": "Pronoun / Interrogative",
        "lesson": "Lesson_06",
        "example": "Ilan ang anak ninyo?"
      },
      {
        "id": "VOCAB-119",
        "word": "ilan-ilan",
        "meaning": "How many each / in groups",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_06",
        "example": "Ilan-ilan ang mga anak nila?"
      },
      {
        "id": "VOCAB-120",
        "word": "kailan",
        "meaning": "When",
        "partOfSpeech": "Adverb / Interrogative",
        "lesson": "Lesson_06",
        "example": "Kailan tayo aalis?"
      },
      {
        "id": "VOCAB-121",
        "word": "kanino",
        "meaning": "Whose / To whom",
        "partOfSpeech": "Pronoun / Possessive",
        "lesson": "Lesson_06",
        "example": "Kanino ang bahay na iyan?"
      },
      {
        "id": "VOCAB-122",
        "word": "kani-kanino",
        "meaning": "Whose (plural items/owners)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_06",
        "example": "Kani-kanino ang mga bahay na iyan?"
      },
      {
        "id": "VOCAB-123",
        "word": "kilala",
        "meaning": "Known / Acquainted",
        "partOfSpeech": "Adjective / Verb",
        "lesson": "Lesson_06",
        "example": "Kilala mo ba siya?"
      },
      {
        "id": "VOCAB-124",
        "word": "kinita",
        "meaning": "Earned / Earnings",
        "partOfSpeech": "Noun / Verb",
        "lesson": "Lesson_06",
        "example": "Magkano ang kinita mo?"
      },
      {
        "id": "VOCAB-125",
        "word": "magkano",
        "meaning": "How much (price)",
        "partOfSpeech": "Word / Interrogative",
        "lesson": "Lesson_06, 07",
        "example": "Magkano ang aklat?"
      },
      {
        "id": "VOCAB-126",
        "word": "magka-magkano",
        "meaning": "How much each",
        "partOfSpeech": "Word",
        "lesson": "Lesson_06",
        "example": "Magka-magkano ang mga aklat?"
      },
      {
        "id": "VOCAB-127",
        "word": "mahaba",
        "meaning": "Long (physical length)",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_06",
        "example": "Mahaba ang tulay."
      },
      {
        "id": "VOCAB-128",
        "word": "malaman",
        "meaning": "To know (a fact/information)",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_06",
        "example": "Paano mo malalaman?"
      },
      {
        "id": "VOCAB-129",
        "word": "matagal",
        "meaning": "Long (time duration)",
        "partOfSpeech": "Adjective / Adverb",
        "lesson": "Lesson_06",
        "example": "Gaano katagal?"
      },
      {
        "id": "VOCAB-130",
        "word": "nakatira",
        "meaning": "Residing / Living",
        "partOfSpeech": "Verb / Adjective",
        "lesson": "Lesson_06",
        "example": "Saan kayo nakatira?"
      },
      {
        "id": "VOCAB-131",
        "word": "nasaan",
        "meaning": "Where is/are (specific location)",
        "partOfSpeech": "Adverb / Interrogative",
        "lesson": "Lesson_06",
        "example": "Nasaan ang susi?"
      },
      {
        "id": "VOCAB-132",
        "word": "paano",
        "meaning": "How (manner / method)",
        "partOfSpeech": "Adverb / Interrogative",
        "lesson": "Lesson_06",
        "example": "Paano ka natutong magluto?"
      },
      {
        "id": "VOCAB-133",
        "word": "pamasahe",
        "meaning": "Fare (transportation cost)",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Magkano ang pamasahe?"
      },
      {
        "id": "VOCAB-134",
        "word": "pangalan",
        "meaning": "Name",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Ano ang pangalan mo?"
      },
      {
        "id": "VOCAB-135",
        "word": "pelikula",
        "meaning": "Movie / Film",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Manood ng pelikula."
      },
      {
        "id": "VOCAB-136",
        "word": "saan",
        "meaning": "Where (direction / location)",
        "partOfSpeech": "Adverb / Interrogative",
        "lesson": "Lesson_06",
        "example": "Saan kayo pupunta?"
      },
      {
        "id": "VOCAB-137",
        "word": "saan-saan",
        "meaning": "Where (plural locations)",
        "partOfSpeech": "Adverb",
        "lesson": "Lesson_06",
        "example": "Saan-saan kayo nakatira?"
      },
      {
        "id": "VOCAB-138",
        "word": "sasama",
        "meaning": "Will come along / join",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_06",
        "example": "Sasama ka ba?"
      },
      {
        "id": "VOCAB-139",
        "word": "sino",
        "meaning": "Who",
        "partOfSpeech": "Pronoun / Interrogative",
        "lesson": "Lesson_06",
        "example": "Sino ba kayo?"
      },
      {
        "id": "VOCAB-140",
        "word": "sinu-sino",
        "meaning": "Who (plural)",
        "partOfSpeech": "Pronoun",
        "lesson": "Lesson_06",
        "example": "Sinu-sino ang inyong mga anak?"
      },
      {
        "id": "VOCAB-141",
        "word": "susi",
        "meaning": "Key",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Nasaan ang susi?"
      },
      {
        "id": "VOCAB-142",
        "word": "tama",
        "meaning": "Correct / Right",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_06",
        "example": "Tama ba ito?"
      },
      {
        "id": "VOCAB-143",
        "word": "tao",
        "meaning": "Person / Human",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Sinong tao 'yan?"
      },
      {
        "id": "VOCAB-144",
        "word": "tinapay",
        "meaning": "Bread",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Sino ang kumain ng tinapay?"
      },
      {
        "id": "VOCAB-145",
        "word": "tingga",
        "meaning": "Lead (heavy metal)",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_06",
        "example": "Mabigat ang tingga."
      },
      {
        "id": "VOCAB-146",
        "word": "uuwi",
        "meaning": "Going home (future tense)",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_06",
        "example": "Uuwi ka na ba?"
      }
    ],
    "activities": [
      {
        "id": "EX-L06-001",
        "lesson": "Lesson_06",
        "type": "fill_in_blank",
        "prompt": "Ask 'Who are you?' in Tagalog: `_____ ba kayo?`",
        "correctAnswer": "Sino` / `sino",
        "acceptedAnswers": [
          "Sino",
          "sino"
        ],
        "explanation": "`Sino` is the interrogative pronoun used to ask 'who'."
      },
      {
        "id": "EX-L06-002",
        "lesson": "Lesson_06",
        "type": "fill_in_blank",
        "prompt": "Ask 'What is your name?' in Tagalog: `_____ ang pangalan mo?`",
        "correctAnswer": "Ano` / `ano` / `Anong` / `Ano'ng",
        "acceptedAnswers": [
          "Ano",
          "ano",
          "Anong",
          "Ano'ng"
        ],
        "explanation": "`Ano` means 'what' in Tagalog."
      },
      {
        "id": "EX-L06-003",
        "lesson": "Lesson_06",
        "type": "translation",
        "prompt": "Translate 'Where is the key?' into Tagalog.",
        "correctAnswer": "Nasaan ang susi?` / `Nasaan ang susi",
        "acceptedAnswers": [
          "Nasaan ang susi?",
          "Nasaan ang susi"
        ],
        "explanation": "`Nasaan` asks for the location or position of a specific item or person."
      },
      {
        "id": "EX-L06-004",
        "lesson": "Lesson_06",
        "type": "fill_in_blank",
        "prompt": "Ask 'How much is the book?' in Tagalog: `_____ ang aklat?`",
        "correctAnswer": "Magkano` / `magkano",
        "acceptedAnswers": [
          "Magkano",
          "magkano"
        ],
        "explanation": "`Magkano` is used to ask about price or monetary cost."
      },
      {
        "id": "EX-L06-005",
        "lesson": "Lesson_06",
        "type": "translation",
        "prompt": "Translate 'Why are you angry?' into Tagalog.",
        "correctAnswer": "Bakit ka galit?` / `Bakit ka galit` / `Bakit siya galit?",
        "acceptedAnswers": [
          "Bakit ka galit?",
          "Bakit ka galit",
          "Bakit siya galit?"
        ],
        "explanation": "`Bakit` asks for reasons or explanations behind an action or feeling."
      },
      {
        "id": "EX-L06-006",
        "lesson": "Lesson_06",
        "type": "fill_in_blank",
        "prompt": "Ask for plural names ('What are your names?'): `_____ ang mga pangalan ninyo?`",
        "correctAnswer": "Anu-ano` / `Anu-ano'y` / `anu-ano",
        "acceptedAnswers": [
          "Anu-ano",
          "Anu-ano'y",
          "anu-ano"
        ],
        "explanation": "`Anu-ano` is the duplicated plural form of `ano` used when expecting plural answers."
      }
    ],
    "quiz": {
      "quiz_metadata": {
        "id": "LESSON_06_QUIZ",
        "lesson": "Lesson_06",
        "title": "Lesson 6 Mastery Exam",
        "topic": "Question Words (Interrogatives) & Plural Questions",
        "total_questions": 8,
        "created_at": "2026-08-22T13:00:00Z"
      },
      "questions": [
        {
          "id": "L06-Q01",
          "type": "multiple_choice",
          "topic": "Interrogative Pronoun Sino",
          "lesson": "Lesson_06",
          "prompt": "Which question word asks 'Who' when inquiring about a person?",
          "options": [
            "Sino",
            "Ano",
            "Alin",
            "Kanino"
          ],
          "correct_answer": "Sino",
          "explanation": "'Sino' asks 'Who' (e.g. Sino ba kayo? = Who are you?)."
        },
        {
          "id": "L06-Q02",
          "type": "multiple_choice",
          "topic": "Interrogative Nasaan vs Saan",
          "lesson": "Lesson_06",
          "prompt": "Which question word specifically asks 'Where is/are [specific object or person]?'",
          "options": [
            "Nasaan",
            "Saan",
            "Kailan",
            "Paano"
          ],
          "correct_answer": "Nasaan",
          "explanation": "'Nasaan' asks for the location of a specific item or person (e.g. Nasaan ang susi?). 'Saan' asks for general location or direction (e.g. Saan ka nakatira?)."
        },
        {
          "id": "L06-Q03",
          "type": "multiple_choice",
          "topic": "Interrogative Ilan vs Magkano",
          "lesson": "Lesson_06",
          "prompt": "Which question word asks for quantity or countable number of items ('How many?')?",
          "options": [
            "Ilan",
            "Magkano",
            "Gaano",
            "Alin"
          ],
          "correct_answer": "Ilan",
          "explanation": "'Ilan' asks 'How many?' (countable items). 'Magkano' asks for price/cost."
        },
        {
          "id": "L06-Q04",
          "type": "multiple_choice",
          "topic": "Interrogative Possession Kanino",
          "lesson": "Lesson_06",
          "prompt": "Which question word asks 'Whose' or 'To whom'?",
          "options": [
            "Kanino",
            "Sino",
            "Ano",
            "Saan"
          ],
          "correct_answer": "Kanino",
          "explanation": "'Kanino' asks 'Whose' or 'To whom' (e.g. Kanino ang bahay na iyan?)."
        },
        {
          "id": "L06-Q05",
          "type": "fill_in_blank",
          "topic": "Pluralization of Sino",
          "lesson": "Lesson_06",
          "prompt": "What is the plural form of the question word 'sino' when asking who multiple people are? ______",
          "correct_answer": "sinu-sino",
          "accepted_answers": [
            "sinu-sino",
            "Sinu-sino",
            "sinusino"
          ],
          "explanation": "2-syllable question words duplicate with 'o' shifting to 'u' in the first part: sino -> sinu-sino."
        },
        {
          "id": "L06-Q06",
          "type": "fill_in_blank",
          "topic": "Pluralization of Ano",
          "lesson": "Lesson_06",
          "prompt": "What is the plural form of 'ano' when asking for multiple items or names? ______",
          "correct_answer": "anu-ano",
          "accepted_answers": [
            "anu-ano",
            "Anu-ano",
            "anuano"
          ],
          "explanation": "Ano duplicates with vowel shift: ano -> anu-ano."
        },
        {
          "id": "L06-Q07",
          "type": "multiple_choice",
          "topic": "Question Word Pluralization Exceptions",
          "lesson": "Lesson_06",
          "prompt": "Which two question words are NEVER duplicated because their nature cannot be pluralized?",
          "options": [
            "Nasaan & Bakit",
            "Sino & Ano",
            "Saan & Kailan",
            "Ilan & Magkano"
          ],
          "correct_answer": "Nasaan & Bakit",
          "explanation": "'Nasaan' (specific location) and 'Bakit' (reason) are never duplicated in Tagalog."
        },
        {
          "id": "L06-Q08",
          "type": "multiple_choice",
          "topic": "Contracted Everyday Questions",
          "lesson": "Lesson_06",
          "prompt": "How does 'Kanino ito?' contract in natural spoken Tagalog?",
          "options": [
            "Kanino 'to?",
            "Kaning ito?",
            "Sino 'to?",
            "Kanino 'yan?"
          ],
          "correct_answer": "Kanino 'to?",
          "explanation": "In spoken Tagalog, demonstratives shorten (ito -> 'to, iyan -> 'yan): 'Kanino 'to?' (Whose is this?)."
        }
      ]
    }
  },
  {
    "id": "LESSON_Lesson_07",
    "lessonKey": "Lesson_07",
    "title": "Lesson 7 — Question Marker BA & Enclitic Particles",
    "summary": "Yes/No question marker BA positioning, second-position enclitic particle hierarchy (na, pa, man, din/rin, daw/raw, nga, naman, lamang/lang).",
    "createdAt": "2026-08-21T00:00:00.000Z",
    "isDefault": true,
    "theory": [
      {
        "id": "THEORY-12",
        "topic": "The Question Marker BA",
        "lesson": "Lesson_07",
        "summary": "The particle 'ba' has no direct English translation but acts as a spoken question mark to explicitly turn statements into questions and avoid ambiguity.",
        "rules": [
          {
            "type": "Direct Order Placement",
            "condition": "Placed after subject and before 'ay' (shortens to ba'y)",
            "example": "Sila ba ay aalis na? / Sila ba'y aalis na?"
          },
          {
            "type": "Inverted Order Placement",
            "condition": "Placed immediately after the predicate",
            "example": "Aalis ba sila? / Mabait ba ang babae?"
          },
          {
            "type": "With Question Words",
            "condition": "Placed immediately after the interrogative pronoun",
            "example": "Sino ba ang kasama mo? / Ano ba ang gusto mo?"
          },
          {
            "type": "Enclitic Monosyllables & Particles",
            "condition": "Monosyllables (ka, ko, mo) and particles (na, pa, din/rin, daw/raw) come before 'ba'",
            "example": "Aalis ka na ba? / Malinis daw ba ang bata?"
          },
          {
            "type": "With Pseudo-Verbs (gusto, ayaw, etc.)",
            "condition": "Placed between pseudo-verb and main verb with ligature -ng attached to ba",
            "example": "Gusto bang kumain ng bata?"
          }
        ]
      },
      {
        "id": "THEORY-13",
        "topic": "Tagalog Enclitic Particles (Na, Pa, Din/Rin, Daw/Raw, Nga)",
        "lesson": "Lesson_07",
        "summary": "Enclitic particles express subtle nuances, emphasis, and time aspect in questions and statements.",
        "table": [
          {
            "pronoun": "na",
            "meaning": "already / now",
            "type": "Finality aspect",
            "usage": "Aalis ka na ba? (Will you leave already?)"
          },
          {
            "pronoun": "pa",
            "meaning": "still / yet / more",
            "type": "Continuation aspect",
            "usage": "Marumi pa ba siya? (Is he/she still dirty?)"
          },
          {
            "pronoun": "din",
            "meaning": "too / also (after consonants)",
            "type": "Inclusion particle",
            "usage": "Ikaw din ba? (You too?)"
          },
          {
            "pronoun": "rin",
            "meaning": "too / also (after vowels)",
            "type": "Inclusion particle",
            "usage": "Ako rin ba? (Me too?)"
          },
          {
            "pronoun": "daw",
            "meaning": "reportedly / they say (after consonants)",
            "type": "Reported speech",
            "usage": "Malinis daw ba ang bata? (Is the child clean as they say?)"
          },
          {
            "pronoun": "raw",
            "meaning": "reportedly / they say (after vowels)",
            "type": "Reported speech",
            "usage": "Ako raw ba? (They say it is I?)"
          },
          {
            "pronoun": "nga",
            "meaning": "indeed / really",
            "type": "Emphasis particle",
            "usage": "Mabait nga siya. (He/she is indeed kind.)"
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "id": "VOCAB-107",
        "word": "aalis",
        "meaning": "Is/are leaving",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_06, 07",
        "example": "Kailan kayo aalis?"
      },
      {
        "id": "VOCAB-117",
        "word": "gusto",
        "meaning": "To like / Want",
        "partOfSpeech": "Pseudo-verb / Verb",
        "lesson": "Lesson_06, 07",
        "example": "Anong gusto mo?"
      },
      {
        "id": "VOCAB-125",
        "word": "magkano",
        "meaning": "How much (price)",
        "partOfSpeech": "Word / Interrogative",
        "lesson": "Lesson_06, 07",
        "example": "Magkano ang aklat?"
      },
      {
        "id": "VOCAB-147",
        "word": "ayaw",
        "meaning": "Does not want / Dislike",
        "partOfSpeech": "Pseudo-verb",
        "lesson": "Lesson_07",
        "example": "Ayaw bang umalis ng babae?"
      },
      {
        "id": "VOCAB-148",
        "word": "ba",
        "meaning": "Question marker",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Mabait ba ang guro?"
      },
      {
        "id": "VOCAB-149",
        "word": "dapat",
        "meaning": "Should / Must / Ought to",
        "partOfSpeech": "Pseudo-verb",
        "lesson": "Lesson_07",
        "example": "Dapat ba siyang magsalita?"
      },
      {
        "id": "VOCAB-150",
        "word": "daw / raw",
        "meaning": "Reportedly / They say",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Malinis daw ba ang bata?"
      },
      {
        "id": "VOCAB-151",
        "word": "din / rin",
        "meaning": "Also / Too",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Maganda rin ba ang damit?"
      },
      {
        "id": "VOCAB-152",
        "word": "ibig",
        "meaning": "Desires / Wishes / Likes",
        "partOfSpeech": "Pseudo-verb",
        "lesson": "Lesson_07",
        "example": "Ibig bang umalis ng lalaki?"
      },
      {
        "id": "VOCAB-153",
        "word": "kaibigan",
        "meaning": "Friend",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_07",
        "example": "Ang kaibigan ko ay si Herbert."
      },
      {
        "id": "VOCAB-154",
        "word": "kapilya",
        "meaning": "Chapel",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_07",
        "example": "Pupunta sa kapilya."
      },
      {
        "id": "VOCAB-155",
        "word": "kasama",
        "meaning": "Companion / Accompanying",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_07",
        "example": "Sino ang kasama mo?"
      },
      {
        "id": "VOCAB-156",
        "word": "kasi",
        "meaning": "Because",
        "partOfSpeech": "Conjunction / Particle",
        "lesson": "Lesson_07",
        "example": "Kasi pagod na ako."
      },
      {
        "id": "VOCAB-157",
        "word": "kaya",
        "meaning": "I wonder / Perhaps / So",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Sino kaya siya?"
      },
      {
        "id": "VOCAB-158",
        "word": "lamang / lang",
        "meaning": "Only / Just",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Isa lang ang aklat."
      },
      {
        "id": "VOCAB-159",
        "word": "maaari",
        "meaning": "May / Can (permission)",
        "partOfSpeech": "Pseudo-verb",
        "lesson": "Lesson_07",
        "example": "Maaari ba akong umalis?"
      },
      {
        "id": "VOCAB-160",
        "word": "magsalita",
        "meaning": "To speak / Talk",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_07",
        "example": "Sila ay magsasalita sa radyo."
      },
      {
        "id": "VOCAB-161",
        "word": "magtiwala",
        "meaning": "To trust",
        "partOfSpeech": "Verb",
        "lesson": "Lesson_07",
        "example": "Magtiwala sa kaibigan."
      },
      {
        "id": "VOCAB-162",
        "word": "man",
        "meaning": "Even / Even if",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Kahit ano man."
      },
      {
        "id": "VOCAB-163",
        "word": "muna",
        "meaning": "First / Beforehand",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Kumain ka muna."
      },
      {
        "id": "VOCAB-164",
        "word": "na",
        "meaning": "Already / Now",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Aalis na ba sila?"
      },
      {
        "id": "VOCAB-165",
        "word": "naman",
        "meaning": "In contrast / On the other hand",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Ikaw naman ang magsalita."
      },
      {
        "id": "VOCAB-166",
        "word": "nga",
        "meaning": "Indeed / Really / Please",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Oo nga, totoo iyan."
      },
      {
        "id": "VOCAB-167",
        "word": "pa",
        "meaning": "Still / Yet / More",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Marumi pa ba siya?"
      },
      {
        "id": "VOCAB-168",
        "word": "pala",
        "meaning": "So it turns out / By the way",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Ikaw pala ang dumating!"
      },
      {
        "id": "VOCAB-169",
        "word": "po / opo",
        "meaning": "Respect particle / Yes (polite)",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Opo, guro ako."
      },
      {
        "id": "VOCAB-170",
        "word": "puwede",
        "meaning": "Can / Possible",
        "partOfSpeech": "Pseudo-verb",
        "lesson": "Lesson_07",
        "example": "Puwede ba akong pumasok?"
      },
      {
        "id": "VOCAB-171",
        "word": "radyo",
        "meaning": "Radio",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_07",
        "example": "Magsalita sa radyo."
      },
      {
        "id": "VOCAB-172",
        "word": "sana",
        "meaning": "Hopefully / I wish",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Sana maganda ang panahon."
      },
      {
        "id": "VOCAB-173",
        "word": "tuloy",
        "meaning": "Consequently / As a result",
        "partOfSpeech": "Particle",
        "lesson": "Lesson_07",
        "example": "Nahuli tuloy kami."
      }
    ],
    "activities": [
      {
        "id": "EX-L07-001",
        "lesson": "Lesson_07",
        "type": "fill_in_blank",
        "prompt": "Turn the statement \"Sila ay aalis na\" into a question: `Sila _____ ay aalis na?`",
        "correctAnswer": "ba` / `ba'y",
        "acceptedAnswers": [
          "ba",
          "ba'y"
        ],
        "explanation": "In direct order, `ba` is placed immediately after the subject and before `ay`."
      },
      {
        "id": "EX-L07-002",
        "lesson": "Lesson_07",
        "type": "fill_in_blank",
        "prompt": "Complete the question \"Will you leave already?\": `Aalis ka _____ _____?`",
        "correctAnswer": "na ba",
        "acceptedAnswers": [
          "na ba"
        ],
        "explanation": "The particle `na` (already) comes before `ba`, following the monosyllabic pronoun `ka`."
      },
      {
        "id": "EX-L07-003",
        "lesson": "Lesson_07",
        "type": "fill_in_blank",
        "prompt": "Complete the question \"Is the child clean as they say?\": `Malinis _____ ba ang bata?`",
        "correctAnswer": "daw",
        "acceptedAnswers": [
          "daw"
        ],
        "explanation": "`Daw` is used after words ending in consonants (`malinis` ends in 's')."
      },
      {
        "id": "EX-L07-004",
        "lesson": "Lesson_07",
        "type": "fill_in_blank",
        "prompt": "Ask \"Does the child like to eat?\": `Gusto _____ kumain ng bata?`",
        "correctAnswer": "bang` / `ba",
        "acceptedAnswers": [
          "bang",
          "ba"
        ],
        "explanation": "`Ba` combined with ligature `-ng` attaches to pseudo-verbs like `gusto` when preceding a main verb."
      }
    ],
    "quiz": {
      "quiz_metadata": {
        "id": "LESSON_07_QUIZ",
        "lesson": "Lesson_07",
        "title": "Lesson 7 Mastery Exam",
        "topic": "The Question Marker BA & Enclitic Particles",
        "total_questions": 8,
        "created_at": "2026-08-22T13:00:00Z"
      },
      "questions": [
        {
          "id": "L07-Q01",
          "type": "multiple_choice",
          "topic": "Question Particle BA",
          "lesson": "Lesson_07",
          "prompt": "What is the main function of the particle 'ba' in Tagalog?",
          "options": [
            "It acts as a spoken question mark to turn statements into explicit questions",
            "It indicates past tense",
            "It marks the subject of the sentence",
            "It connects adjectives to nouns"
          ],
          "correct_answer": "It acts as a spoken question mark to turn statements into explicit questions",
          "explanation": "The particle 'ba' explicitly turns a statement into a question (e.g. Aalis ka. -> Aalis ka ba?)."
        },
        {
          "id": "L07-Q02",
          "type": "multiple_choice",
          "topic": "BA Placement with Monosyllabic Pronouns",
          "lesson": "Lesson_07",
          "prompt": "When combining 'ba' with monosyllabic pronouns like 'ka', 'ko', or 'mo', where is 'ba' placed?",
          "options": [
            "AFTER the monosyllabic pronoun (e.g. Aalis ka ba?)",
            "BEFORE the monosyllabic pronoun (e.g. Aalis ba ka?)",
            "At the very end of the sentence only",
            "At the beginning of the sentence"
          ],
          "correct_answer": "AFTER the monosyllabic pronoun (e.g. Aalis ka ba?)",
          "explanation": "Monosyllabic pronouns (ka, ko, mo) come BEFORE 'ba': 'Aalis ka ba?' (NOT 'ba ka')."
        },
        {
          "id": "L07-Q03",
          "type": "multiple_choice",
          "topic": "Enclitic Particles Na vs Pa",
          "lesson": "Lesson_07",
          "prompt": "Which particle means 'already' or 'now' (expressing finality aspect)?",
          "options": [
            "na",
            "pa",
            "din",
            "daw"
          ],
          "correct_answer": "na",
          "explanation": "'Na' means 'already' or 'now' (e.g. Uuwi ka na ba? = Are you going home already?)."
        },
        {
          "id": "L07-Q04",
          "type": "multiple_choice",
          "topic": "Enclitic Particles Na vs Pa",
          "lesson": "Lesson_07",
          "prompt": "Which particle means 'still', 'yet', or 'more' (expressing continuation aspect)?",
          "options": [
            "pa",
            "na",
            "rin",
            "raw"
          ],
          "correct_answer": "pa",
          "explanation": "'Pa' means 'still' or 'yet' (e.g. Marumi pa ba siya? = Is he/she still dirty?)."
        },
        {
          "id": "L07-Q05",
          "type": "fill_in_blank",
          "topic": "Din vs Rin Sound Shift",
          "lesson": "Lesson_07",
          "prompt": "Which form of 'also / too' is used after a word ending in a VOWEL ('Ako ___')? ______",
          "correct_answer": "rin",
          "accepted_answers": [
            "rin",
            "Rin"
          ],
          "explanation": "'Rin' is used after vowels ('Ako rin'). 'Din' is used after consonants ('Ikaw din')."
        },
        {
          "id": "L07-Q06",
          "type": "fill_in_blank",
          "topic": "Daw vs Raw Sound Shift",
          "lesson": "Lesson_07",
          "prompt": "Which form of reported speech ('they say / reportedly') is used after a CONSONANT ('Malinis ___')? ______",
          "correct_answer": "daw",
          "accepted_answers": [
            "daw",
            "Daw"
          ],
          "explanation": "'Daw' is used after consonants ('Malinis daw'). 'Raw' is used after vowels ('Ako raw')."
        },
        {
          "id": "L07-Q07",
          "type": "multiple_choice",
          "topic": "Emphasis Particle Nga",
          "lesson": "Lesson_07",
          "prompt": "Which particle expresses emphasis or confirmation ('indeed / really')?",
          "options": [
            "nga",
            "na",
            "pa",
            "ba"
          ],
          "correct_answer": "nga",
          "explanation": "'Nga' is the emphasis particle meaning 'indeed' or 'really' (e.g. Mabait nga siya)."
        },
        {
          "id": "L07-Q08",
          "type": "multiple_choice",
          "topic": "BA Placement with Interrogative Words",
          "lesson": "Lesson_07",
          "prompt": "Where is 'ba' placed in sentences containing question words (e.g. 'Sino', 'Ano')?",
          "options": [
            "Immediately after the question word (e.g. Sino ba ang kasama mo?)",
            "At the end of the sentence",
            "Before the question word",
            "Between the subject and verb"
          ],
          "correct_answer": "Immediately after the question word (e.g. Sino ba ang kasama mo?)",
          "explanation": "In interrogative sentences, 'ba' immediately follows the question word (e.g. Sino ba, Ano ba)."
        }
      ]
    }
  },
  {
    "id": "LESSON_Lesson_08",
    "lessonKey": "Lesson_08",
    "title": "Lesson 8 — Comparisons, Intensives & Superlatives",
    "summary": "Adjective degrees: equality comparisons (kasing-), inequality (mas... kaysa), intensives (napaka-), and superlatives (pinaka-).",
    "createdAt": "2026-08-21T00:00:00.000Z",
    "isDefault": true,
    "theory": [
      {
        "id": "THEORY-14",
        "topic": "Expressing Equality in Comparisons (Kasing-, Magkasing-, Pareho, Katulad, Gaya)",
        "lesson": "Lesson_08",
        "summary": "Tagalog uses prefixes kasing- and magkasing- or words pareho, katulad, gaya to express that two items possess equal degree of a quality.",
        "table": [
          {
            "pronoun": "kasing-",
            "meaning": "as [adjective] as",
            "type": "Attached to root (a, e, i, o, u, k, g, h, m, n, w, y)",
            "usage": "Si Maria ay kasingganda ni Elena."
          },
          {
            "pronoun": "kasin-",
            "meaning": "as [adjective] as",
            "type": "Sound shift before d, l, r, s, t",
            "usage": "kasindumi, kasinrunong"
          },
          {
            "pronoun": "kasim-",
            "meaning": "as [adjective] as",
            "type": "Sound shift before b, p",
            "usage": "kasimbait, kasimbaho"
          },
          {
            "pronoun": "magkasing-",
            "meaning": "are equally [adjective]",
            "type": "Used when subjects are side by side",
            "usage": "Sina Maria at Elena ay magkasingganda."
          },
          {
            "pronoun": "pareho / katulad / gaya",
            "meaning": "similar to / like",
            "type": "Words expressing similarity",
            "usage": "Si Maria ay maganda gaya ni Elena."
          }
        ]
      },
      {
        "id": "THEORY-15",
        "topic": "Expressing Inequality in Comparisons (Mas, Lalong, Higit na, Kaysa / Kesa)",
        "lesson": "Lesson_08",
        "summary": "To express that item A has a higher degree (superiority) or lower degree (inferiority) than item B.",
        "rules": [
          {
            "type": "Superiority (A > B)",
            "pattern": "A + mas / lalong / higit na + [adjective] + kaysa kay/sa + B",
            "example": "Si Peter ay mas marunong kaysa kay John. / Ang matanda ay lalong masipag kaysa sa bata."
          },
          {
            "type": "Kaysa kay vs Kaysa sa",
            "condition": "Kaysa kay followed by person's name; Kaysa sa followed by thing or place name (shortened to kesa)",
            "example": "kaysa kay John vs kaysa sa bata"
          },
          {
            "type": "Inferiority (A < B)",
            "pattern": "A + hindi + kasin-[adjective] + ni/ng + B",
            "example": "Si John ay hindi kasinrunong ni Peter. (John is not as bright as Peter.)"
          }
        ]
      },
      {
        "id": "THEORY-16",
        "topic": "Intensives and Superlatives (Napaka-, Adjective Duplication, Pinaka-)",
        "lesson": "Lesson_08",
        "summary": "Intensives express 'very [adjective]' using napaka- or duplication with ligatures. Superlatives express 'the most / -est' using the prefix pinaka-.",
        "rules": [
          {
            "type": "Intensive by Duplication",
            "pattern": "[Adjective] + ligature (-ng, -g, na) + [Adjective]",
            "example": "magandang-maganda (very beautiful), pangit na pangit (very ugly)"
          },
          {
            "type": "Intensive by Prefix napaka-",
            "pattern": "napaka- + [Adjective root]",
            "example": "napakaganda (very beautiful), napakasipag (very industrious)"
          },
          {
            "type": "Superlative by Prefix pinaka-",
            "pattern": "pinaka- + [Adjective]",
            "example": "pinakamaganda (most beautiful), pinakamalaking bahay (biggest house), pinakamataas na bundok (highest mountain)"
          }
        ]
      }
    ],
    "vocabulary": [
      {
        "id": "VOCAB-174",
        "word": "bughaw",
        "meaning": "Blue",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_08",
        "example": "Pinakabughaw na langit."
      },
      {
        "id": "VOCAB-175",
        "word": "galing / magaling",
        "meaning": "Skill / Good / Excellent",
        "partOfSpeech": "Adjective / Noun",
        "lesson": "Lesson_08",
        "example": "Magkasinggaling sina Rizal at Bonifacio."
      },
      {
        "id": "VOCAB-176",
        "word": "gaya",
        "meaning": "Like / Similar to",
        "partOfSpeech": "Preposition",
        "lesson": "Lesson_08",
        "example": "Si Maria ay maganda gaya ni Elena."
      },
      {
        "id": "VOCAB-177",
        "word": "higit / higit na",
        "meaning": "More / Exceedingly",
        "partOfSpeech": "Adverb",
        "lesson": "Lesson_08",
        "example": "Higit na marunong si Peter kaysa kay John."
      },
      {
        "id": "VOCAB-178",
        "word": "hindi kasing-",
        "meaning": "Not as... as (inferiority)",
        "partOfSpeech": "Phrase / Prefix",
        "lesson": "Lesson_08",
        "example": "Hindi kasinrunong si John ni Peter."
      },
      {
        "id": "VOCAB-179",
        "word": "ilog",
        "meaning": "River",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_08",
        "example": "Pinakamalinaw na ilog."
      },
      {
        "id": "VOCAB-180",
        "word": "indayog",
        "meaning": "Rhythm",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_08",
        "example": "Maganda ang indayog ng awit."
      },
      {
        "id": "VOCAB-181",
        "word": "istilo",
        "meaning": "Style",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_08",
        "example": "Makabago ang istilo."
      },
      {
        "id": "VOCAB-182",
        "word": "kasing-",
        "meaning": "As... as (equality prefix)",
        "partOfSpeech": "Prefix",
        "lesson": "Lesson_08",
        "example": "Kasingganda ni Maria si Elena."
      },
      {
        "id": "VOCAB-183",
        "word": "kasin-",
        "meaning": "As... as (before d, l, r, s, t)",
        "partOfSpeech": "Prefix",
        "lesson": "Lesson_08",
        "example": "Kasindumi ng sapatos."
      },
      {
        "id": "VOCAB-184",
        "word": "kasim-",
        "meaning": "As... as (before b, p)",
        "partOfSpeech": "Prefix",
        "lesson": "Lesson_08",
        "example": "Kasimbait ng ina."
      },
      {
        "id": "VOCAB-185",
        "word": "katulad / tulad",
        "meaning": "Similar to / Like",
        "partOfSpeech": "Preposition / Adjective",
        "lesson": "Lesson_08",
        "example": "Katulad ng kapatid niya."
      },
      {
        "id": "VOCAB-186",
        "word": "kaysa / kaysa kay / kaysa sa",
        "meaning": "Than (comparison)",
        "partOfSpeech": "Preposition",
        "lesson": "Lesson_08",
        "example": "Mas masipag ang matanda kaysa sa bata."
      },
      {
        "id": "VOCAB-187",
        "word": "kesa",
        "meaning": "Than (colloquial kaysa)",
        "partOfSpeech": "Preposition",
        "lesson": "Lesson_08",
        "example": "Mas mabilis kesa sa kotse."
      },
      {
        "id": "VOCAB-188",
        "word": "kulot",
        "meaning": "Curly",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_08",
        "example": "Kasingkulot ng buhok mo."
      },
      {
        "id": "VOCAB-189",
        "word": "labis",
        "meaning": "Excessive / Too much",
        "partOfSpeech": "Adjective / Adverb",
        "lesson": "Lesson_08",
        "example": "Labis ang ganda."
      },
      {
        "id": "VOCAB-190",
        "word": "lakas / malakas",
        "meaning": "Strength / Strong",
        "partOfSpeech": "Adjective / Noun",
        "lesson": "Lesson_08",
        "example": "Pinakamalakas na lalaki."
      },
      {
        "id": "VOCAB-191",
        "word": "lalo / lalong",
        "meaning": "Even more / Greater degree",
        "partOfSpeech": "Adverb",
        "lesson": "Lesson_08",
        "example": "Lalong masipag si tatay."
      },
      {
        "id": "VOCAB-192",
        "word": "mabaho",
        "meaning": "Foul-smelling / Stinky",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_08",
        "example": "Magkasimbaho ang basura."
      },
      {
        "id": "VOCAB-193",
        "word": "mabigat",
        "meaning": "Heavy",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_08",
        "example": "Mabigat ang bakal."
      },
      {
        "id": "VOCAB-194",
        "word": "magkasing-",
        "meaning": "Both equally... (prefix)",
        "partOfSpeech": "Prefix",
        "lesson": "Lesson_08",
        "example": "Sina Maria at Elena ay magkasingganda."
      },
      {
        "id": "VOCAB-195",
        "word": "makabago",
        "meaning": "Modern / Innovative",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_08",
        "example": "Makabago ang istilo."
      },
      {
        "id": "VOCAB-196",
        "word": "malawak",
        "meaning": "Broad / Vast",
        "partOfSpeech": "Adjective",
        "lesson": "Lesson_08",
        "example": "Malawak ang dagat."
      },
      {
        "id": "VOCAB-197",
        "word": "mas",
        "meaning": "More (comparative marker)",
        "partOfSpeech": "Particle / Adverb",
        "lesson": "Lesson_08",
        "example": "Mas masipag si Helen."
      },
      {
        "id": "VOCAB-198",
        "word": "napaka-",
        "meaning": "Very (intensive prefix)",
        "partOfSpeech": "Prefix",
        "lesson": "Lesson_08",
        "example": "Napakaganda ng bulaklak."
      },
      {
        "id": "VOCAB-199",
        "word": "pareho",
        "meaning": "Same / Both equal",
        "partOfSpeech": "Adjective / Adverb",
        "lesson": "Lesson_08",
        "example": "Maganda pareho ni Elena."
      },
      {
        "id": "VOCAB-200",
        "word": "pinaka-",
        "meaning": "Most / -est (superlative prefix)",
        "partOfSpeech": "Prefix",
        "lesson": "Lesson_08",
        "example": "Pinakamalaking bahay."
      },
      {
        "id": "VOCAB-201",
        "word": "sing-",
        "meaning": "As... as (short form prefix)",
        "partOfSpeech": "Prefix",
        "lesson": "Lesson_08",
        "example": "Singtangkad mo siya."
      },
      {
        "id": "VOCAB-202",
        "word": "tono / boses",
        "meaning": "Tone / Voice",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_08",
        "example": "Malawak ang tono ng boses."
      },
      {
        "id": "VOCAB-203",
        "word": "tugtugin",
        "meaning": "Music piece / Tune",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_08",
        "example": "Maganda ang tugtugin."
      },
      {
        "id": "VOCAB-204",
        "word": "yelo",
        "meaning": "Ice",
        "partOfSpeech": "Noun",
        "lesson": "Lesson_08",
        "example": "Pinakamalamig na yelo."
      }
    ],
    "activities": [
      {
        "id": "EX-L08-001",
        "lesson": "Lesson_08",
        "type": "fill_in_blank",
        "prompt": "Express \"Maria is as beautiful as Elena\": `Si Maria ay __________ ni Elena.` (Root: `ganda`)",
        "correctAnswer": "kasingganda` / `kasing-ganda",
        "acceptedAnswers": [
          "kasingganda",
          "kasing-ganda"
        ],
        "explanation": "`Kasing-` + root `ganda` expresses equality (\"as beautiful as\")."
      },
      {
        "id": "EX-L08-002",
        "lesson": "Lesson_08",
        "type": "fill_in_blank",
        "prompt": "Express \"Maria and Elena are equally beautiful\": `Sina Maria at Elena ay __________.` (Root: `ganda`)",
        "correctAnswer": "magkasingganda` / `magkasing-ganda",
        "acceptedAnswers": [
          "magkasingganda",
          "magkasing-ganda"
        ],
        "explanation": "`Magkasing-` is used when comparing two subjects side by side."
      },
      {
        "id": "EX-L08-003",
        "lesson": "Lesson_08",
        "type": "translation",
        "prompt": "Translate \"Peter is brighter than John\" into Tagalog using `mas`.",
        "correctAnswer": "Mas marunong si Peter kaysa kay John.` / `Si Peter ay mas marunong kaysa kay John.",
        "acceptedAnswers": [
          "Mas marunong si Peter kaysa kay John.",
          "Si Peter ay mas marunong kaysa kay John."
        ],
        "explanation": "`Mas` + adjective + `kaysa kay` + [Person's name] expresses superiority."
      },
      {
        "id": "EX-L08-004",
        "lesson": "Lesson_08",
        "type": "fill_in_blank",
        "prompt": "Complete the sentence for \"This mountain is the highest mountain\": `Ang bundok na ito ang __________ na bundok.` (Root: `taas`)",
        "correctAnswer": "pinakamataas` / `pinaka-mataas",
        "acceptedAnswers": [
          "pinakamataas",
          "pinaka-mataas"
        ],
        "explanation": "The prefix `pinaka-` attached to `mataas` forms the superlative degree (\"the highest\")."
      }
    ],
    "quiz": {
      "quiz_metadata": {
        "id": "LESSON_08_QUIZ",
        "lesson": "Lesson_08",
        "title": "Lesson 8 Mastery Exam",
        "topic": "Comparisons (Equality & Inequality), Intensives & Superlatives",
        "total_questions": 8,
        "created_at": "2026-08-22T13:00:00Z"
      },
      "questions": [
        {
          "id": "L08-Q01",
          "type": "multiple_choice",
          "topic": "Comparative Superiority",
          "lesson": "Lesson_08",
          "prompt": "Which modifier is placed before an adjective to express 'more' (comparative degree, e.g. 'more handsome')?",
          "options": [
            "mas",
            "pinaka",
            "napaka",
            "kasing"
          ],
          "correct_answer": "mas",
          "explanation": "'Mas' expresses comparative degree ('more' / '-er', e.g. Mas gwapo = more handsome)."
        },
        {
          "id": "L08-Q02",
          "type": "multiple_choice",
          "topic": "Kaysa kay vs Kaysa sa",
          "lesson": "Lesson_08",
          "prompt": "In comparative sentences, when comparing against a person's proper name (e.g. 'than John'), which preposition is used?",
          "options": [
            "kaysa kay John",
            "kaysa sa John",
            "gaya ng John",
            "ni John"
          ],
          "correct_answer": "kaysa kay John",
          "explanation": "'Kaysa kay' is used before a person's proper name. 'Kaysa sa' is used before common nouns or places."
        },
        {
          "id": "L08-Q03",
          "type": "multiple_choice",
          "topic": "Equality Comparison Kasing-",
          "lesson": "Lesson_08",
          "prompt": "Which prefix attaches to an adjective root to express equality ('as [adjective] as')?",
          "options": [
            "kasing-",
            "pinaka-",
            "napaka-",
            "mas"
          ],
          "correct_answer": "kasing-",
          "explanation": "'Kasing-' expresses equal quality ('as X as', e.g. kasingganda = as beautiful as)."
        },
        {
          "id": "L08-Q04",
          "type": "fill_in_blank",
          "topic": "Sound Shift before B and P",
          "lesson": "Lesson_08",
          "prompt": "Before root words starting with 'b' or 'p' (e.g. 'bait'), 'kasing-' shifts to 'kasim-'. What is the correct form for 'as kind as'? ______",
          "correct_answer": "kasimbait",
          "accepted_answers": [
            "kasimbait",
            "Kasimbait"
          ],
          "explanation": "Sound shift: kasing- + bait -> kasimbait (the 'n' shifts to 'm' before 'b' or 'p')."
        },
        {
          "id": "L08-Q05",
          "type": "multiple_choice",
          "topic": "Equality with Plural Subjects",
          "lesson": "Lesson_08",
          "prompt": "When two subjects are compared side-by-side (e.g. 'Sina Maria at Elena ay ___'), which prefix is used for equal beauty?",
          "options": [
            "magkasingganda",
            "kasingganda",
            "mas maganda",
            "pinakamaganda"
          ],
          "correct_answer": "magkasingganda",
          "explanation": "'Magkasing-' is used when subjects are listed together (e.g. Sina Maria at Elena ay magkasingganda)."
        },
        {
          "id": "L08-Q06",
          "type": "multiple_choice",
          "topic": "Intensive Prefix Napaka-",
          "lesson": "Lesson_08",
          "prompt": "Which prefix expresses 'very' or 'extremely' when attached to an adjective root (e.g. 'extremely beautiful')?",
          "options": [
            "napaka-",
            "pinaka-",
            "kasing-",
            "mas"
          ],
          "correct_answer": "napaka-",
          "explanation": "'Napaka-' means 'very / extremely' (e.g. napakaganda = extremely beautiful)."
        },
        {
          "id": "L08-Q07",
          "type": "fill_in_blank",
          "topic": "Superlative Prefix Pinaka-",
          "lesson": "Lesson_08",
          "prompt": "Which prefix forms the superlative degree ('the most' / '-est', e.g. 'most delicious' -> '___masarap')? ______",
          "correct_answer": "pinaka",
          "accepted_answers": [
            "pinaka",
            "pinaka-",
            "Pinaka"
          ],
          "explanation": "'Pinaka-' forms the superlative degree (e.g. pinakamasarap = most delicious)."
        },
        {
          "id": "L08-Q08",
          "type": "multiple_choice",
          "topic": "Intensive Duplication with Ligatures",
          "lesson": "Lesson_08",
          "prompt": "How can an adjective be duplicated with a ligature to express 'very [adjective]' (e.g. 'very beautiful')?",
          "options": [
            "magandang-maganda",
            "maganda maganda",
            "mga maganda",
            "magandang"
          ],
          "correct_answer": "magandang-maganda",
          "explanation": "Duplicating the adjective with a ligature (-ng, -g, na) expresses intensive degree: maganda + -ng + maganda = magandang-maganda."
        }
      ]
    }
  }
];
