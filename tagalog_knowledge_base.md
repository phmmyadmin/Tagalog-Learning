# Tagalog Knowledge Base

> **Classified Master Document for Learning and Web Application Generation**
> 
> This document consolidates all knowledge extracted from all lesson files in `md_sources/`.
> It includes an **integrated JSON data structure** enabling automated scripts to build an interactive web application (flashcards, quiz engine, grammar guides), along with clean, human-readable Markdown sections for direct study.

---

## ─── 🤖 DATA STRUCTURE FOR GENERATOR SCRIPTS (JSON SCHEMA) ───

```json
{
  "metadata": {
    "title": "Tagalog Knowledge Base",
    "lessons_covered": ["Lesson_02", "Lesson_03", "Lesson_04", "Lesson_05", "Lesson_06", "Lesson_07", "Lesson_08"],
    "total_vocab_terms": 138,
    "total_grammar_topics": 16,
    "total_exercises": 44,
    "categories": ["Theory", "Vocabulary", "Activities"]
  },
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
        {"rule": "Adjective plural: duplicate first syllable of root", "example": "mabait (good) -> mababait (good, plural)"},
        {"rule": "Adjective plural: duplicate first syllable of root", "example": "maganda (beautiful) -> magaganda (beautiful, plural)"},
        {"rule": "Adjective plural: duplicate first syllable of root", "example": "malaki (big) -> malalaki (big, plural)"},
        {"rule": "Adjective plural: duplicate first syllable of root", "example": "marunong (intelligent) -> marurunong (intelligent, plural)"},
        {"rule": "Adjective plural: duplicate first syllable of root", "example": "malinis (clean) -> malilinis (clean, plural)"},
        {"rule": "Adjective plural: duplicate first syllable of root", "example": "malusog (healthy) -> malulusog (healthy, plural)"},
        {"rule": "Adjective plural: duplicate first syllable of root", "example": "masipag (hardworking) -> masisipag (hardworking, plural)"},
        {"rule": "Noun pluralization using marker 'mga'", "example": "bata (child) -> mga bata (children)"}
      ]
    },
    {
      "id": "THEORY-04",
      "topic": "Nominative Personal Pronouns",
      "lesson": "Lesson_03",
      "summary": "Nominative pronouns function as the subject of a sentence. They can appear at the beginning (before 'ay') or after the predicate in inverted order. The linker 'ay' may be shortened to ''y' when the preceding word ends in a vowel.",
      "table": [
        {"pronoun": "ako", "meaning": "I", "type": "1st Person Singular", "contraction": "Ako'y"},
        {"pronoun": "ikaw / ka", "meaning": "You (singular)", "type": "2nd Person Singular", "usage": "'ikaw' at sentence start, 'ka' after predicate"},
        {"pronoun": "siya", "meaning": "He / She", "type": "3rd Person Singular", "contraction": "Siya'y"},
        {"pronoun": "kami", "meaning": "We (exclusive — excludes listener)", "type": "1st Person Plural (excl.)", "contraction": "Kami'y"},
        {"pronoun": "tayo", "meaning": "We (inclusive — includes listener)", "type": "1st Person Plural (incl.)", "contraction": "Tayo'y"},
        {"pronoun": "kayo", "meaning": "You (plural / polite singular)", "type": "2nd Person Plural", "contraction": "Kayo'y", "polite": "Used with 'po' for respect"},
        {"pronoun": "sila", "meaning": "They / Polite singular", "type": "3rd Person Plural", "contraction": "Sila'y", "polite": "Used with 'po' for respect"}
      ]
    },
    {
      "id": "THEORY-05",
      "topic": "Demonstrative Pronouns and Modifiers",
      "lesson": "Lesson_04",
      "summary": "Demonstrative pronouns point out objects based on distance from speaker and listener. They can also function as modifiers connected to nouns via ligatures.",
      "table": [
        {"pronoun": "ito", "meaning": "This (near speaker)", "plural": "ang mga ito (these)"},
        {"pronoun": "iyan", "meaning": "That (near listener)", "plural": "ang mga iyan (those)"},
        {"pronoun": "iyon", "meaning": "That over there (far from both)", "plural": "ang mga iyon (those over there)"}
      ]
    },
    {
      "id": "THEORY-06",
      "topic": "Connectives or Ligatures (-ng, -g, na)",
      "lesson": "Lesson_04",
      "summary": "Ligatures link adjacent words to show a modifying relationship. The suffix -ng is used after vowels, -g after the consonant 'n', and the word 'na' after other consonants. They connect adjective+noun, noun+noun, noun+verb, verb+adverb, and many other word-pair sequences.",
      "rules": [
        {"ligature": "-ng", "condition": "After words ending in vowels (a, e, i, o, u)", "example": "malaki + bahay -> malaking bahay (big house)"},
        {"ligature": "-g", "condition": "After words ending in consonant 'n'", "example": "mayaman + lalaki -> mayamang lalaki (rich man)"},
        {"ligature": "na", "condition": "Between words where the first ends in consonants other than 'n'", "example": "tahimik + bata -> tahimik na bata (quiet child)"},
        {"ligature": "-ng", "condition": "Adjective + Noun sequence", "example": "maganda + babae -> magandang babae (beautiful woman)"},
        {"ligature": "-ng", "condition": "Noun + Noun sequence", "example": "bata + babae -> batang babae (young girl)"},
        {"ligature": "-ng", "condition": "Noun + Verb / Verb + Noun sequence", "example": "bata + kumakain -> batang kumakain (child eating)"},
        {"ligature": "na", "condition": "Verb + Adjective / Adjective + Verb", "example": "pagod + dumating -> pagod na dumating (arrived tired)"},
        {"ligature": "-g", "condition": "Verb + Adverb / Adverb + Verb sequence", "example": "kumain + mabilis -> kumaing mabilis (ate quickly)"},
        {"ligature": "na", "condition": "Adjective + Adverb / Adverb + Adjective sequence", "example": "mabilis + masyado -> mabilis na masyado (too fast)"},
        {"ligature": "Exception", "condition": "Verb + Verb: Helping verb + main verb need NO ligature", "example": "ayaw + kumain -> ayaw kumain (does not want to eat)"},
        {"ligature": "-ng", "condition": "Pronoun + Noun / Noun + Pronoun", "example": "ito + mesa -> itong mesa (this table)"},
        {"ligature": "Exception", "condition": "Pronoun + Adjective: Adjective + nominative pronoun needs NO ligature", "example": "marunong + ka -> marunong ka (you are smart)"},
        {"ligature": "na", "condition": "Repeated adjective for superlative", "example": "mabait + mabait -> mabait na mabait (very kind)"},
        {"ligature": "Rule", "condition": "Multiple adjectives before a noun", "example": "Only the LAST adjective takes the ligature: mabait at masunuring aso"}
      ]
    },
    {
      "id": "THEORY-07",
      "topic": "Possessive Words and Pronouns",
      "lesson": "Lesson_05",
      "summary": "Possession is indicated by 'ni' (before proper nouns) and 'ng' (before common nouns). Possessive pronouns have two forms: pre-noun (with ligature) and post-noun. The possessed object ALWAYS comes before the owner in Tagalog.",
      "rules": [
        {"type": "Proper Noun Possessive", "singular": "ni Maria", "plural": "nina Maria at Pedro"},
        {"type": "Common Noun Possessive", "singular": "ng lalaki", "plural": "ng mga bata"},
        {"type": "Possessive Word Order", "description": "The possessed object ALWAYS precedes the owner (e.g. ang bahay ni Maria — Maria's house)."},
        {"type": "Pre-Noun vs Post-Noun Possessive Pronouns", "pairs": [
          {"pre": "akin", "post": "ko", "meaning": "my / mine"},
          {"pre": "iyo", "post": "mo", "meaning": "your / yours"},
          {"pre": "kaniya / kanya", "post": "niya", "meaning": "his / her / hers"},
          {"pre": "amin", "post": "namin", "meaning": "our / ours (exclusive)"},
          {"pre": "atin", "post": "natin", "meaning": "our / ours (inclusive)"},
          {"pre": "inyo", "post": "ninyo", "meaning": "your / yours (plural)"},
          {"pre": "kanila", "post": "nila", "meaning": "their / theirs"}
        ]},
        {"type": "Demonstrative Possessives", "forms": [
          {"word": "nito", "meaning": "of this person (near speaker)", "example": "ang bahay nito"},
          {"word": "niyan", "meaning": "of that person (near listener)", "example": "ang bahay niyan"},
          {"word": "niyon", "meaning": "of that person (far from both)", "example": "ang bahay niyon"}
        ]},
        {"type": "Plural possessive forms", "description": "Plural possessives: 'ng mga ito', 'ng mga iyan', 'ng mga iyon' (of these/those people)."}
      ]
    },
    {
      "id": "THEORY-08",
      "topic": "Basic Verb Tenses (Introduction)",
      "lesson": "Lesson_02",
      "summary": "Tagalog verbs change form to indicate tense. Three basic forms are introduced: past (completed), present (ongoing), and future (not yet started).",
      "rules": [
        {"tense": "Past (Completed)", "pattern": "nag- prefix + root", "example": "naglaro (played)"},
        {"tense": "Present (Ongoing)", "pattern": "nag- prefix + duplicated first syllable + root", "example": "naglalaro (is playing)"},
        {"tense": "Future (Not yet started)", "pattern": "mag- prefix + duplicated first syllable + root", "example": "maglalaro (will play)"},
        {"tense": "Past (Completed)", "pattern": "Example with kumain", "example": "kumain (ate)"},
        {"tense": "Present (Ongoing)", "pattern": "Example with kumain", "example": "kumakain (is eating)"},
        {"tense": "Past (Completed)", "pattern": "Example with luto", "example": "nagluto (cooked)"},
        {"tense": "Present (Ongoing)", "pattern": "Example with luto", "example": "nagluluto (is cooking)"}
      ]
    },
    {
      "id": "THEORY-09",
      "topic": "Question Words (Interrogative Pronouns & Adverbs)",
      "lesson": "Lesson_06",
      "summary": "Tagalog uses 12 main interrogative words corresponding to who, what, which, how, why, when, where, how many, how much, and whose. Question words appear at the start of sentences.",
      "table": [
        {"pronoun": "Sino", "meaning": "Who", "type": "Interrogative Pronoun (person)", "contraction": "Sino'y", "usage": "Sino ba kayo? (Who are you?)"},
        {"pronoun": "Ano", "meaning": "What", "type": "Interrogative Pronoun (things/ideas)", "contraction": "Ano'y", "usage": "Ano ito? (What is this?)"},
        {"pronoun": "Alin", "meaning": "Which", "type": "Interrogative Pronoun (selection)", "usage": "Alin ba ang iyong gusto? (Which do you like?)"},
        {"pronoun": "Gaano", "meaning": "How (extent/degree)", "type": "Interrogative Adverb (degree)", "usage": "Gaano katagal? (How long? Requires ka- + adjective)"},
        {"pronoun": "Paano", "meaning": "How (manner/method)", "type": "Interrogative Adverb (method)", "usage": "Paano ka natutong magluto? (How did you learn to cook?)"},
        {"pronoun": "Bakit", "meaning": "Why", "type": "Interrogative Adverb (reason)", "usage": "Bakit siya galit? (Why is he/she angry?)"},
        {"pronoun": "Kailan", "meaning": "When", "type": "Interrogative Adverb (time)", "usage": "Kailan kayo dumating? (When did you arrive?)"},
        {"pronoun": "Nasaan", "meaning": "Where is/are", "type": "Interrogative Adverb (location of specific item/person)", "usage": "Nasaan ang susi? (Where is the key? Followed by specific noun)"},
        {"pronoun": "Saan", "meaning": "Where", "type": "Interrogative Adverb (direction/general location)", "usage": "Saan kayo nakatira? (Where do you live?)"},
        {"pronoun": "Ilan", "meaning": "How many", "type": "Interrogative Pronoun/Adjective (count)", "usage": "Ilan ang anak ninyo? (How many children do you have?)"},
        {"pronoun": "Magkano", "meaning": "How much", "type": "Interrogative Word (price/cost)", "usage": "Magkano ang aklat? (How much is the book?)"},
        {"pronoun": "Kanino", "meaning": "Whose / To whom", "type": "Interrogative Pronoun (possession)", "usage": "Kanino ang bahay na iyan? (Whose house is that?)"}
      ]
    },
    {
      "id": "THEORY-10",
      "topic": "Pluralization of Question Words",
      "lesson": "Lesson_06",
      "summary": "Plural forms of question words are created by duplicating the whole word (for 2-syllable words) or the first two syllables (for 3+ syllable words) when referring to multiple items or expecting a plural response. Note: nasaan and bakit are never duplicated.",
      "table": [
        {"pronoun": "sinu-sino", "meaning": "Who (plural)", "type": "2-syllable duplication (o -> u)", "usage": "Sinu-sino ang inyong mga anak? (Which of the children are yours?)"},
        {"pronoun": "anu-ano", "meaning": "What (plural)", "type": "2-syllable duplication (o -> u)", "usage": "Anu-ano ang mga pangalan ninyo? (What are your names?)"},
        {"pronoun": "alin-alin", "meaning": "Which (plural)", "type": "2-syllable duplication", "usage": "Alin-alin ang mga aklat mo? (Which ones are your books?)"},
        {"pronoun": "saan-saan", "meaning": "Where (plural locations)", "type": "2-syllable duplication", "usage": "Saan-saan kayo nakatira? (Where do you all live?)"},
        {"pronoun": "ilan-ilan", "meaning": "How many (each/per group)", "type": "2-syllable duplication", "usage": "Ilan-ilan ang mga anak nila? (How many children do they each have?)"},
        {"pronoun": "kani-kanino", "meaning": "Whose (plural items/owners)", "type": "3+ syllable first 2 syllable duplication", "usage": "Kani-kanino ang mga bahay na iyan? (Whose houses are those?)"},
        {"pronoun": "magka-magkano", "meaning": "How much each", "type": "3+ syllable first 2 syllable duplication", "usage": "Magka-magkano ang mga aklat? (How much are each of the books?)"}
      ],
      "rules": [
        {"rule": "2-syllable words", "condition": "Duplicate whole word", "example": "alin -> alin-alin, sino -> sinu-sino"},
        {"rule": "3+ syllable words", "condition": "Duplicate first two syllables", "example": "kanino -> kani-kanino, magkano -> magka-magkano"},
        {"rule": "Vowel shift 'o' -> 'u'", "condition": "Last syllable 'o' changes to 'u' in duplicated prefix", "example": "ano -> anu-ano, sino -> sinu-sino"},
        {"rule": "Exceptions", "condition": "nasaan & bakit are NEVER duplicated", "example": "Nothing can be in two places at once; no duplicate explanations"}
      ]
    },
    {
      "id": "THEORY-11",
      "topic": "Contracted Questions and Common Everyday Phrases",
      "lesson": "Lesson_06",
      "summary": "In spoken Tagalog, question words frequently combine with ligatures (-ng) and demonstratives (ito -> 'to, iyan -> 'yan) to create natural contracted questions.",
      "rules": [
        {"type": "Contracted Sino", "example_tagalog": "Sinong tao 'yan?", "example_english": "Who is that person?"},
        {"type": "Contracted Kanino", "example_tagalog": "Kanino 'to?", "example_english": "Whose is this?"},
        {"type": "Contracted Ano", "example_tagalog": "Ano 'yan?", "example_english": "What's that?"},
        {"type": "Everyday Question: Do you know?", "example_tagalog": "Kilala mo ba siya?", "example_english": "Do you know her/him?"},
        {"type": "Everyday Question: Are you coming?", "example_tagalog": "Sasama ka ba?", "example_english": "Are you coming along?"},
        {"type": "Everyday Question: Going home?", "example_tagalog": "Uuwi ka na ba?", "example_english": "Are you going home already?"},
        {"type": "Everyday Question: Correct?", "example_tagalog": "Tama ba ito?", "example_english": "Is this correct?"}
      ]
    },
    {
      "id": "THEORY-12",
      "topic": "The Question Marker BA",
      "lesson": "Lesson_07",
      "summary": "The particle 'ba' has no direct English translation but acts as a spoken question mark to explicitly turn statements into questions and avoid ambiguity.",
      "rules": [
        {"type": "Direct Order Placement", "condition": "Placed after subject and before 'ay' (shortens to ba'y)", "example": "Sila ba ay aalis na? / Sila ba'y aalis na?"},
        {"type": "Inverted Order Placement", "condition": "Placed immediately after the predicate", "example": "Aalis ba sila? / Mabait ba ang babae?"},
        {"type": "With Question Words", "condition": "Placed immediately after the interrogative pronoun", "example": "Sino ba ang kasama mo? / Ano ba ang gusto mo?"},
        {"type": "Enclitic Monosyllables & Particles", "condition": "Monosyllables (ka, ko, mo) and particles (na, pa, din/rin, daw/raw) come before 'ba'", "example": "Aalis ka na ba? / Malinis daw ba ang bata?"},
        {"type": "With Pseudo-Verbs (gusto, ayaw, etc.)", "condition": "Placed between pseudo-verb and main verb with ligature -ng attached to ba", "example": "Gusto bang kumain ng bata?"}
      ]
    },
    {
      "id": "THEORY-13",
      "topic": "Tagalog Enclitic Particles (Na, Pa, Din/Rin, Daw/Raw, Nga)",
      "lesson": "Lesson_07",
      "summary": "Enclitic particles express subtle nuances, emphasis, and time aspect in questions and statements.",
      "table": [
        {"pronoun": "na", "meaning": "already / now", "type": "Finality aspect", "usage": "Aalis ka na ba? (Will you leave already?)"},
        {"pronoun": "pa", "meaning": "still / yet / more", "type": "Continuation aspect", "usage": "Marumi pa ba siya? (Is he/she still dirty?)"},
        {"pronoun": "din", "meaning": "too / also (after consonants)", "type": "Inclusion particle", "usage": "Ikaw din ba? (You too?)"},
        {"pronoun": "rin", "meaning": "too / also (after vowels)", "type": "Inclusion particle", "usage": "Ako rin ba? (Me too?)"},
        {"pronoun": "daw", "meaning": "reportedly / they say (after consonants)", "type": "Reported speech", "usage": "Malinis daw ba ang bata? (Is the child clean as they say?)"},
        {"pronoun": "raw", "meaning": "reportedly / they say (after vowels)", "type": "Reported speech", "usage": "Ako raw ba? (They say it is I?)"},
        {"pronoun": "nga", "meaning": "indeed / really", "type": "Emphasis particle", "usage": "Mabait nga siya. (He/she is indeed kind.)"}
      ]
    },
    {
      "id": "THEORY-14",
      "topic": "Expressing Equality in Comparisons (Kasing-, Magkasing-, Pareho, Katulad, Gaya)",
      "lesson": "Lesson_08",
      "summary": "Tagalog uses prefixes kasing- and magkasing- or words pareho, katulad, gaya to express that two items possess equal degree of a quality.",
      "table": [
        {"pronoun": "kasing-", "meaning": "as [adjective] as", "type": "Attached to root (a, e, i, o, u, k, g, h, m, n, w, y)", "usage": "Si Maria ay kasingganda ni Elena."},
        {"pronoun": "kasin-", "meaning": "as [adjective] as", "type": "Sound shift before d, l, r, s, t", "usage": "kasindumi, kasinrunong"},
        {"pronoun": "kasim-", "meaning": "as [adjective] as", "type": "Sound shift before b, p", "usage": "kasimbait, kasimbaho"},
        {"pronoun": "magkasing-", "meaning": "are equally [adjective]", "type": "Used when subjects are side by side", "usage": "Sina Maria at Elena ay magkasingganda."},
        {"pronoun": "pareho / katulad / gaya", "meaning": "similar to / like", "type": "Words expressing similarity", "usage": "Si Maria ay maganda gaya ni Elena."}
      ]
    },
    {
      "id": "THEORY-15",
      "topic": "Expressing Inequality in Comparisons (Mas, Lalong, Higit na, Kaysa / Kesa)",
      "lesson": "Lesson_08",
      "summary": "To express that item A has a higher degree (superiority) or lower degree (inferiority) than item B.",
      "rules": [
        {"type": "Superiority (A > B)", "pattern": "A + mas / lalong / higit na + [adjective] + kaysa kay/sa + B", "example": "Si Peter ay mas marunong kaysa kay John. / Ang matanda ay lalong masipag kaysa sa bata."},
        {"type": "Kaysa kay vs Kaysa sa", "condition": "Kaysa kay followed by person's name; Kaysa sa followed by thing or place name (shortened to kesa)", "example": "kaysa kay John vs kaysa sa bata"},
        {"type": "Inferiority (A < B)", "pattern": "A + hindi + kasin-[adjective] + ni/ng + B", "example": "Si John ay hindi kasinrunong ni Peter. (John is not as bright as Peter.)"}
      ]
    },
    {
      "id": "THEORY-16",
      "topic": "Intensives and Superlatives (Napaka-, Adjective Duplication, Pinaka-)",
      "lesson": "Lesson_08",
      "summary": "Intensives express 'very [adjective]' using napaka- or duplication with ligatures. Superlatives express 'the most / -est' using the prefix pinaka-.",
      "rules": [
        {"type": "Intensive by Duplication", "pattern": "[Adjective] + ligature (-ng, -g, na) + [Adjective]", "example": "magandang-maganda (very beautiful), pangit na pangit (very ugly)"},
        {"type": "Intensive by Prefix napaka-", "pattern": "napaka- + [Adjective root]", "example": "napakaganda (very beautiful), napakasipag (very industrious)"},
        {"type": "Superlative by Prefix pinaka-", "pattern": "pinaka- + [Adjective]", "example": "pinakamaganda (most beautiful), pinakamalaking bahay (biggest house), pinakamataas na bundok (highest mountain)"}
      ]
    }
  ]
}
```

---

## 📘 SECTION 1: THEORY & GRAMMAR RULES

### 1.1 Articles in Tagalog
In Tagalog, articles precede nouns and specify whether they are proper or common nouns, as well as their grammatical number (singular or plural).

| Article | Noun Type | Number | Tagalog Example | English Translation |
| :--- | :--- | :--- | :--- | :--- |
| **Si** | Proper Noun | Singular | Si Liza ay babae. | Liza is a woman. |
| **Sina** | Proper Noun | Plural (2+ people) | Sina Simon at Tom ay mababait. | Simon and Tom are good. |
| **Ang** | Common Noun / Place | Singular | Ang bata ay mabait. | The child is good. |
| **Ang mga** | Common Noun / Place | Plural | Ang mga bata ay naglalaro. | The children are playing. |

> [!NOTE]
> When using `sina Tom`, it translates to "Tom and his companions / family". The word `mga` (pronounced "manga") is a plural marker that has no standalone meaning.

> [!IMPORTANT]
> The article `ang` must always precede the name of a place. It is acceptable to omit the second `ang` before a second place name (e.g. *Ang Manila at Washington D.C. ay mga lungsod*).

---

### 1.2 Sentence Structure and Word Order
There are two fundamental ways to construct sentences in Tagalog:

#### 1. Direct Word Order (Subject - Predicate)
* **Pattern**: `[Subject] + ay + [Predicate]`
* **Usage**: Used when the subject is the most important element of the sentence.
* **Examples**:
  - *Ang bahay ay malaki.* (The house is big.)
  - *Si Peter ay mabait.* (Peter is good.)
  - *Sina Peter at Mary ay mga bata.* (Peter and Mary are children.)
  - *Ang mga bata ay kumakain.* (The children are eating.)
  - *Ang babae at lalaki ay nagluluto.* (The woman and the man are cooking.)

#### 2. Inverted / Transposed Word Order (Predicate - Subject)
* **Pattern**: `[Predicate] + [Subject]` (Does **NOT** use the word **AY**!)
* **Usage**: Emphasizes the predicate rather than the subject. This is the most natural, colloquial form.
* **Examples**:
  - *Malaki ang bahay.* (The house is big.)
  - *Kumakain ang bata.* (The child is eating.)
  - *Mabait si Peter.* (Peter is good.)

#### Inverted Order with Plural Subjects:
When plural nouns form the subject in inverted word order, `mga` (not `ang mga`) comes before the first noun:
- *Mga lungsod ang Manila at Cebu.* (Manila and Cebu are cities.)
- *Mga babae sina Lisa at Cha.* (Lisa and Cha are women.)

#### Contraction of AY:
The linker `ay` may be shortened to `'y` when the preceding word ends in a vowel:
- *Ako'y si John.* (I am John.)
- *Siya'y isang bata.* (He/She is a child.)
- *Kami'y nag-aaral.* (We are studying.)

---

### 1.3 Pluralization of Adjectives
In Tagalog, adjectives form their plural by **duplicating the first syllable of the adjective root word**:

| Root | Singular Form | Plural Form | English Meaning |
| :--- | :--- | :--- | :--- |
| bait | mabait | mababait | good / kind |
| ganda | maganda | magaganda | beautiful |
| laki | malaki | malalaki | big |
| dunong | marunong | marurunong | intelligent |
| linis | malinis | malilinis | clean |
| lusog | malusog | malulusog | healthy |
| sipag | masipag | masisipag | hardworking |
| tangkad | matangkad | matatangkad | tall |

> [!NOTE]
> Tagalog follows a **plurality rule**: either the subject or predicate may be plural, but pluralizing both is optional.

---

### 1.4 Personal Pronouns (Nominative)
Nominative personal pronouns function as the subject of the sentence.

| Pronoun | English Meaning | Type | Contraction | Example |
| :--- | :--- | :--- | :--- | :--- |
| **Ako** | I | 1st Pers. Singular | **Ako'y** | Ako'y si John. / Masipag ako. |
| **Ikaw / Ka** | You (singular) | 2nd Pers. Singular | — | Ikaw ay maganda. / Maganda ka. |
| **Siya** | He / She | 3rd Pers. Singular | **Siya'y** | Siya'y bata. / Marunong siya. |
| **Kami** | We (exclusive) | 1st Pers. Plural (excl.) | **Kami'y** | Kami'y nag-aaral. / Mababait kami. |
| **Tayo** | We (inclusive) | 1st Pers. Plural (incl.) | **Tayo'y** | Tayo'y magkaibigan. / Mababait tayo. |
| **Kayo** | You (plural/polite) | 2nd Pers. Plural | **Kayo'y** | Kayo ay mga Pilipino. / Malulusog kayo. |
| **Sila** | They / Polite | 3rd Pers. Plural | **Sila'y** | Sila ay marurunong. |

> [!TIP]
> **Difference between Ikaw and Ka**: `Ikaw` is used at the **beginning** of the sentence. `Ka` is used **after the predicate** in inverted order. Example: *Ikaw ay marunong.* = *Marunong ka.*

> [!TIP]
> **Difference between Kami and Tayo**: `Kami` excludes the listener ("he/she and I, but not you"). `Tayo` includes the listener ("you, he/she, and I").

> [!IMPORTANT]
> **Politeness & Respect**: To address elders or respected persons, use plural pronouns `kayo` or `sila` combined with `po` (e.g. *Kayo po ba ay guro?* — Are you a teacher, sir/madam?).

---

### 1.5 Demonstrative Pronouns and Modifiers

#### Basic Demonstratives
- **Ito** (This): Object very close to the speaker. Contraction: *Ito'y*
- **Iyan** (That): Object near the listener.
- **Iyon** (That over there): Object far from both speaker and listener.

#### Plural Demonstratives
Formed by prefixing the plural article `ang mga`:
- **Ang mga ito** (These)
- **Ang mga iyan** (Those near listener)
- **Ang mga iyon** (Those over there)

#### Demonstratives as Modifiers (with Ligatures)
Demonstratives can be placed before or after the noun they modify:
- *Itong mesa* / *Mesang ito* (This table)
- *Iyang suot* / *Suot na iyan* (Those clothes)
- *Iyong bahay* / *Bahay na iyon* (That house over there)

#### Location Usage with `sa`
When indicating location with `sa`, demonstratives appear after the noun at the sentence end:
- *Ang bata ay kumain sa mesang ito.* (The child ate at this table.)
- *Pumunta kami sa bahay na iyan.* (We went to that house.)
- *Sumakay sila sa bus na iyon.* (They rode on that bus.)

---

### 1.6 Connectives or Ligatures
Ligatures link adjacent words to signal a modifying relationship.

#### Selection Rules:
1. **Suffix `-ng`**: Attached to words ending in **Vowels** (a, e, i, o, u).
   - *malaki* + *bahay* → **malaking bahay** (big house)
   - *bata* + *babae* → **batang babae** (young girl)
2. **Suffix `-g`**: Attached to words ending in the consonant **N**.
   - *mayaman* + *lalaki* → **mayamang lalaki** (rich man)
   - *kumain* + *mabilis* → **kumaing mabilis** (ate quickly)
3. **Word `na`**: Placed between words when the first word ends in **Consonants other than N**.
   - *tahimik* + *bata* → **tahimik na bata** (quiet child)
   - *maasim* + *mangga* → **maasim na mangga** (sour mango)
   - *pagod* + *dumating* → **pagod na dumating** (arrived tired)

#### Word Sequences Requiring Ligatures:
- Adjective + Noun (or Noun + Adjective)
- Noun + Noun
- Noun + Verb (or Verb + Noun)
- Adjective + Verb (or Verb + Adjective)
- Verb + Adverb (or Adverb + Verb)
- Noun + Adverb (or Adverb + Noun)
- Adjective + Adverb (or Adverb + Adjective)
- Verb + Verb (exception: helping verb + main verb do NOT need a ligature; e.g. *Ayaw kumain*)
- Pronoun + Noun / Noun + Pronoun
- Pronoun + Adjective / Adjective + Pronoun (exception: adjective + nominative pronoun needs no ligature; e.g. *Marunong ka*)

#### Superlative by Repetition:
Repeating an adjective with a ligature creates a superlative:
- *Mabait na mabait ang guro ko.* (My teacher is very kind.)
- *Malinaw na malinaw ang utos niya.* (His command is very clear.)

#### Multiple Adjectives:
In a series of multiple adjectives before a noun, only the **last adjective** takes a ligature:
- *Mabait at masunuring aso.* (Good and obedient dog)

> [!NOTE]
> Changing the sequence of words does NOT change the meaning, but ligature rules always apply to the first word: *batang babae* = *babaeng bata* (young girl).

---

### 1.7 Possessive Expressions & Pronouns

#### 1. Possession with Proper and Common Nouns
In Tagalog, the **possessed object ALWAYS comes before the owner**:

- **Ni** (Singular proper noun): *ang bahay ni Maria* (Maria's house)
- **Nina** (Plural proper nouns): *ang bahay nina Maria at Pedro* (Maria and Pedro's house)
- **Ng** (Singular common noun): *ang lapis ng guro* (the teacher's pencil)
- **Ng mga** (Plural common nouns): *ang sapatos ng mga bata* (the children's shoes)

#### 2. Possessive Pronouns: Pre-Noun (Base) vs Post-Noun

| Person | Pre-Noun Base Form | Post-Noun Form | English Meaning |
| :--- | :--- | :--- | :--- |
| 1st Sing. | **Akin** | **Ko** | My / Mine |
| 2nd Sing. | **Iyo** | **Mo** | Your / Yours |
| 3rd Sing. | **Kaniya / Kanya** | **Niya** | His / Her / Hers |
| 1st Plur. (Excl.) | **Amin** | **Namin** | Our / Ours (excl.) |
| 1st Plur. (Incl.) | **Atin** | **Natin** | Our / Ours (incl.) |
| 2nd Plur. | **Inyo** | **Ninyo** | Your / Yours (plural) |
| 3rd Plur. | **Kanila** | **Nila** | Their / Theirs |

> [!NOTE]
> When placed **before a noun**, ligatures (`-g` or `-ng`) are attached to these base forms: *akin* + *-g* → **aking bahay**; *iyo* + *-ng* → **iyong baro**.

*Examples*:
- Pre-noun (with ligature): *Ang aking bahay ay malaki.* → Post-noun: *Ang bahay ko ay malaki.* (My house is big.)
- Pre-noun (with ligature): *Ang iyong baro ay bago.* → Post-noun: *Ang baro mo ay bago.* (Your dress is new.)

> [!TIP]
> **Avoiding Redundancy**: If a sentence uses the same possessor twice, mix pre-noun and post-noun forms: *Ang kanyang ina ay pumunta sa bahay niya.* (Her mother went to her house.)

> [!IMPORTANT]
> For plural nouns, possessive pronouns go between `ang` and `mga`: *Ang aking mga anak ay mababait.* (My children are good.) NOT *Ang mga aking anak...*

#### 3. Demonstrative Possessives (`nito`, `niyan`, `niyon`)
Indicate demonstrative ownership ("of this", "of that") and are placed **after the noun**:
- **Nito** (of this person — near speaker): *Ang bahay nito ay malaki.*
- **Niyan** (of that person — near listener): *Ang bahay niyan ay maliit.*
- **Niyon** (of that person — far from both): *Ang bahay niyon ay maliit.*

Plural forms use `ng mga` + demonstrative: *ang bahay ng mga ito* (the house of these people).

---

### 1.8 Basic Verb Tenses (Introduction)
Tagalog verbs change form to indicate tense. Three basic tense aspects are introduced:

| Tense | Formation Pattern | Example (root: laro) | English |
| :--- | :--- | :--- | :--- |
| **Past** (Completed) | nag- + root | naglaro | played |
| **Present** (Ongoing) | nag- + duplicated syllable + root | naglalaro | is playing |
| **Future** (Not yet) | mag- + duplicated syllable + root | maglalaro | will play |

More verb examples from the lessons:
- *kumain* (ate) → *kumakain* (is eating)
- *nagluto* (cooked) → *nagluluto* (is cooking)
- *nag-aral* (studied) → *nag-aaral* (is studying)

---

## 📕 SECTION 2: CONSOLIDATED VOCABULARY DICTIONARY

The following table contains all vocabulary terms extracted from the lessons, categorized by part of speech.

| Tagalog Term | English Meaning | Part of Speech | Lesson Origin | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| **ako** | I / Me | Pronoun | Lesson_03 | Ako ay si John. |
| **aklat** | Book | Noun | Lesson_02 | Ang aklat ni Paulo. |
| **amin** | Our (exclusive) | Possessive Pronoun | Lesson_05 | Ang aming kotse. |
| **ang** | The (singular marker) | Article | Lesson_02 | Ang bata ay mabait. |
| **araw** | Sun / Day | Noun | Lesson_02, 04 | Magandang araw. |
| **aso** | Dog | Noun | Lesson_02 | Ang mga aso ay mababait. |
| **atin** | Our (inclusive) | Possessive Pronoun | Lesson_05 | Ang ating bahay. |
| **babae** | Woman / Girl | Noun | Lesson_02 | Si Liza ay babae. |
| **bago** | New | Adjective | Lesson_02, 05 | Ang baro mo ay bago. |
| **bahay** | House | Noun | Lesson_02, 05 | Malaki ang bahay. |
| **bansa** | Nation / Country | Noun | Lesson_02 | Malaki ang bansa. |
| **bata** | Child / Young | Noun / Adjective | Lesson_02 | Siya ay bata. |
| **binata** | Bachelor / Unmarried man | Noun | Lesson_04 | Ang binata ay masipag. |
| **bintana** | Window | Noun | Lesson_04 | Nakabukas ang bintana. |
| **bulaklak** | Flower | Noun | Lesson_02, 04 | Maganda ang bulaklak. |
| **bundok** | Mountain | Noun | Lesson_04 | Mataas ang bundok. |
| **dagat** | Sea / Ocean | Noun | Lesson_04 | Malaki ang dagat. |
| **dahon** | Leaf | Noun | Lesson_04 | Berde ang dahon. |
| **dalaga** | Unmarried woman / Maiden | Noun | Lesson_04 | Maganda ang dalaga. |
| **damit / baro** | Clothes / Dress | Noun | Lesson_04, 05 | Maganda ang damit. |
| **gabi** | Night | Noun | Lesson_04 | Gabing-gabi na. |
| **gamot** | Medicine | Noun | Lesson_04, 05 | Bumili ng gamot. |
| **gulay** | Vegetable | Noun | Lesson_04 | Masarap ang gulay. |
| **guro** | Teacher | Noun | Lesson_03, 05 | Kayo po ba ay guro? |
| **hangal** | Fool | Noun / Adjective | Lesson_04 | Ang hangal na ito ay umiyak. |
| **hangin** | Wind | Noun | Lesson_02 | Malamig ang hangin. |
| **ibon** | Bird | Noun | Lesson_04 | Lumilipad ang ibon. |
| **ikaw / ka** | You (singular) | Pronoun | Lesson_03 | Ikaw ay marunong. / Marunong ka. |
| **inapi** | Maltreated | Adjective | Lesson_04 | Tayong kanilang inapi ay natuto. |
| **inyo** | Your (plural) | Possessive Pronoun | Lesson_05 | Ang inyong ama. |
| **isda** | Fish | Noun | Lesson_02, 04 | Masarap ang isda. |
| **ito** | This | Demonstrative | Lesson_04 | Ito'y pagkain. |
| **iyan** | That (near listener) | Demonstrative | Lesson_04 | Iyan ay pagkain. |
| **iyon** | That over there (far) | Demonstrative | Lesson_04 | Iyon ay ilog. |
| **kami** | We (exclusive) | Pronoun | Lesson_03 | Kami ay nag-aaral. |
| **kaniya / kanya** | His / Her | Possessive Pronoun | Lesson_05 | Kanyang sapatos. |
| **kanila** | Their / Theirs | Possessive Pronoun | Lesson_05 | Kanilang lapis. |
| **kapé** | Coffee | Noun | Lesson_02, 03 | Umiinom ng kape. |
| **kayo** | You (plural / polite) | Pronoun | Lesson_03 | Kayo ay mga Pilipino. |
| **kotse** | Car | Noun | Lesson_02, 05 | Luma ang kotse. |
| **kumakain** | Eating (present tense) | Verb | Lesson_02 | Kumakain ang bata. |
| **lamok** | Mosquito | Noun | Lesson_04 | Maliit ang lamok. |
| **langit** | Sky | Noun | Lesson_04 | Bughaw ang langit. |
| **lapis** | Pencil | Noun | Lesson_02, 05 | Ang lapis ni Helen. |
| **luma** | Old (for inanimate objects) | Adjective | Lesson_02, 05 | Luma ang kotse. |
| **lungsod** | City | Noun | Lesson_02 | Ang Manila ay lungsod. |
| **lugar** | Place | Noun | Lesson_02 | Maganda ang lugar. |
| **mababa** | Low | Adjective | Lesson_02 | Mababa ang mesa. |
| **mabait** | Good / Kind | Adjective | Lesson_02 | Mabait si Peter. |
| **mabilis** | Fast | Adjective / Adverb | Lesson_04 | Kumaing mabilis si Pablo. |
| **mabuti** | Good (condition / quality) | Adjective | Lesson_02 | Mabuti ang lagay. |
| **madilim** | Dark | Adjective | Lesson_04 | Madilim ang gabi. |
| **maganda** | Beautiful | Adjective | Lesson_02 | Si Ruth ay maganda. |
| **magkaibigan** | Friends | Noun | Lesson_03 | Tayo'y magkaibigan. |
| **magkapatid** | Siblings | Noun | Lesson_02, 03 | Magkapatid sila. |
| **mahal** | Expensive / Beloved | Adjective | Lesson_02, 04 | Mahal ang relo. |
| **mahirap** | Poor / Difficult | Adjective | Lesson_02, 03 | Mahirap kami. |
| **mahusay** | Efficient | Adjective | Lesson_04 | Mahusay ang guro. |
| **maingay** | Noisy | Adjective | Lesson_03, 04 | Maingay kayo. |
| **mainit** | Hot | Adjective | Lesson_02, 04 | Mainit ang kape. |
| **maitim** | Black | Adjective | Lesson_04 | Maitim ang aso. |
| **malamig** | Cold | Adjective | Lesson_02, 05 | Malamig ang tubig. |
| **malaki** | Big | Adjective | Lesson_02 | Malaki ang bahay. |
| **malinaw** | Clear | Adjective | Lesson_04 | Malinaw ang tubig. |
| **malinis** | Clean | Adjective | Lesson_02 | Malinis ang sapatos. |
| **maliit** | Small | Adjective | Lesson_02, 04 | Maliit ito. |
| **malusog** | Healthy | Adjective | Lesson_02, 03 | Malusog ako. |
| **mapagbigay** | Generous | Adjective | Lesson_04 | Ang mayamang lalaki ay mapagbigay. |
| **maputi** | Whitish / Fair-skinned | Adjective | Lesson_04 | Maputi ang babae. |
| **marami** | Plenty / Many | Adjective / Adverb | Lesson_03, 04 | Marami iyan. |
| **marunong / matalino** | Intelligent / Learned | Adjective | Lesson_02, 03 | Marunong si Peter. |
| **marumi** | Dirty | Adjective | Lesson_04, 05 | Marumi ang baro. |
| **maasim** | Sour | Adjective | Lesson_04 | Maasim na mangga. |
| **masarap** | Delicious | Adjective | Lesson_02 | Masarap ang pagkain. |
| **masipag** | Industrious / Hardworking | Adjective | Lesson_03 | Masipag ako. |
| **mataas** | High / Tall | Adjective | Lesson_02 | Mataas ang bundok. |
| **mataba** | Fat | Adjective | Lesson_02, 04 | Mataba ang aso. |
| **matamis** | Sweet (food) | Adjective | Lesson_04 | Matamis ang prutas. |
| **matanda** | Old (animate beings) | Adjective | Lesson_02 | Matandang lalaki. |
| **matangkad** | Tall (person) | Adjective | Lesson_03 | Matangkad ka. |
| **matapang** | Brave | Adjective | Lesson_04 | Matapang ang sundalo. |
| **mayaman** | Rich / Wealthy | Adjective | Lesson_04 | Ang mayamang lalaki. |
| **mesa / lamesa** | Table | Noun | Lesson_02, 04 | Malinis ang mesa. |
| **mga** | Plural marker | Particle | Lesson_02 | Ang mga bata. |
| **mura** | Cheap | Adjective | Lesson_02 | Mura ang pagkain. |
| **naglalaro** | Playing (present tense) | Verb | Lesson_02, 03 | Siya ay naglalaro. |
| **nagluluto** | Cooking (present tense) | Verb | Lesson_02 | Nagluluto ang babae. |
| **nag-aaral** | Studying (present tense) | Verb | Lesson_03 | Nag-aaral kami. |
| **paaralan** | School | Noun | Lesson_02, 05 | Ang paaralan ay malaki. |
| **pagkain** | Food | Noun | Lesson_02, 04, 05 | Masarap ang pagkain. |
| **pagod** | Tired | Adjective | Lesson_04 | Pagod na dumating si tatay. |
| **pangit** | Ugly | Adjective | Lesson_02 | Pangit ang aso. |
| **papél** | Paper | Noun | Lesson_02 | Ang papél ni John. |
| **payat** | Thin | Adjective | Lesson_04 | Payat ang bata. |
| **pusa** | Cat | Noun | Lesson_02 | Mabait ang pusa. |
| **sanggol** | Baby | Noun | Lesson_05 | Ang baro ng sanggol. |
| **sapatos** | Shoes | Noun | Lesson_02, 05 | Malilinis ang sapatos. |
| **sariwa** | Fresh | Adjective | Lesson_04 | Sariwa ang gulay. |
| **sila** | They | Pronoun | Lesson_03 | Sila ay magkaibigan. |
| **silya** | Chair | Noun | Lesson_02 | Ang silya ay bago. |
| **simbahan** | Church | Noun | Lesson_02 | Malaki ang simbahan. |
| **siya** | He / She | Pronoun | Lesson_03 | Siya ay bata. |
| **tahimik** | Quiet | Adjective | Lesson_04 | Tahimik na bata. |
| **tamad** | Lazy | Adjective | Lesson_04 | Tamad ang lalaki. |
| **tayo** | We (inclusive) | Pronoun | Lesson_03 | Tayo'y magkaibigan. |
| **tubig** | Water | Noun | Lesson_02, 04 | Mainit ang tubig. |
| **aalis** | Is/are leaving | Verb | Lesson_06, 07 | Kailan kayo aalis? |
| **alin** | Which | Pronoun / Interrogative | Lesson_06 | Alin ba ang iyong gusto? |
| **alin-alin** | Which (plural) | Pronoun | Lesson_06 | Alin-alin ang mga aklat mo? |
| **ano** | What | Pronoun / Interrogative | Lesson_06 | Ano ito? |
| **anu-ano** | What (plural) | Pronoun | Lesson_06 | Anu-ano ang mga pangalan ninyo? |
| **bakal** | Iron (metal) | Noun | Lesson_06 | Alin ang mas mabigat: bakal o tingga? |
| **bakit** | Why | Adverb / Interrogative | Lesson_06 | Bakit siya galit? |
| **dumating** | Arrived | Verb | Lesson_06 | Kailan kayo dumating sa Pilipinas? |
| **gaano** | How (extent / degree) | Adverb / Interrogative | Lesson_06 | Gaano kalaki ang bahay mo? |
| **galit** | Angry | Adjective | Lesson_06 | Bakit siya galit? |
| **gusto** | To like / Want | Pseudo-verb / Verb | Lesson_06, 07 | Anong gusto mo? |
| **ilan** | How many | Pronoun / Interrogative | Lesson_06 | Ilan ang anak ninyo? |
| **ilan-ilan** | How many each / in groups | Pronoun | Lesson_06 | Ilan-ilan ang mga anak nila? |
| **kailan** | When | Adverb / Interrogative | Lesson_06 | Kailan tayo aalis? |
| **kanino** | Whose / To whom | Pronoun / Possessive | Lesson_06 | Kanino ang bahay na iyan? |
| **kani-kanino** | Whose (plural items/owners) | Pronoun | Lesson_06 | Kani-kanino ang mga bahay na iyan? |
| **kilala** | Known / Acquainted | Adjective / Verb | Lesson_06 | Kilala mo ba siya? |
| **kinita** | Earned / Earnings | Noun / Verb | Lesson_06 | Magkano ang kinita mo? |
| **magkano** | How much (price) | Word / Interrogative | Lesson_06, 07 | Magkano ang aklat? |
| **magka-magkano** | How much each | Word | Lesson_06 | Magka-magkano ang mga aklat? |
| **mahaba** | Long (physical length) | Adjective | Lesson_06 | Mahaba ang tulay. |
| **malaman** | To know (a fact/information) | Verb | Lesson_06 | Paano mo malalaman? |
| **matagal** | Long (time duration) | Adjective / Adverb | Lesson_06 | Gaano katagal? |
| **nakatira** | Residing / Living | Verb / Adjective | Lesson_06 | Saan kayo nakatira? |
| **nasaan** | Where is/are (specific location) | Adverb / Interrogative | Lesson_06 | Nasaan ang susi? |
| **paano** | How (manner / method) | Adverb / Interrogative | Lesson_06 | Paano ka natutong magluto? |
| **pamasahe** | Fare (transportation cost) | Noun | Lesson_06 | Magkano ang pamasahe? |
| **pangalan** | Name | Noun | Lesson_06 | Ano ang pangalan mo? |
| **pelikula** | Movie / Film | Noun | Lesson_06 | Manood ng pelikula. |
| **saan** | Where (direction / location) | Adverb / Interrogative | Lesson_06 | Saan kayo pupunta? |
| **saan-saan** | Where (plural locations) | Adverb | Lesson_06 | Saan-saan kayo nakatira? |
| **sasama** | Will come along / join | Verb | Lesson_06 | Sasama ka ba? |
| **sino** | Who | Pronoun / Interrogative | Lesson_06 | Sino ba kayo? |
| **sinu-sino** | Who (plural) | Pronoun | Lesson_06 | Sinu-sino ang inyong mga anak? |
| **susi** | Key | Noun | Lesson_06 | Nasaan ang susi? |
| **tama** | Correct / Right | Adjective | Lesson_06 | Tama ba ito? |
| **tao** | Person / Human | Noun | Lesson_06 | Sinong tao 'yan? |
| **tinapay** | Bread | Noun | Lesson_06 | Sino ang kumain ng tinapay? |
| **tingga** | Lead (heavy metal) | Noun | Lesson_06 | Mabigat ang tingga. |
| **uuwi** | Going home (future tense) | Verb | Lesson_06 | Uuwi ka na ba? |
| **ayaw** | Does not want / Dislike | Pseudo-verb | Lesson_07 | Ayaw bang umalis ng babae? |
| **ba** | Question marker | Particle | Lesson_07 | Mabait ba ang guro? |
| **dapat** | Should / Must / Ought to | Pseudo-verb | Lesson_07 | Dapat ba siyang magsalita? |
| **daw / raw** | Reportedly / They say | Particle | Lesson_07 | Malinis daw ba ang bata? |
| **din / rin** | Also / Too | Particle | Lesson_07 | Maganda rin ba ang damit? |
| **ibig** | Desires / Wishes / Likes | Pseudo-verb | Lesson_07 | Ibig bang umalis ng lalaki? |
| **kaibigan** | Friend | Noun | Lesson_07 | Ang kaibigan ko ay si Herbert. |
| **kapilya** | Chapel | Noun | Lesson_07 | Pupunta sa kapilya. |
| **kasama** | Companion / Accompanying | Noun | Lesson_07 | Sino ang kasama mo? |
| **kasi** | Because | Conjunction / Particle | Lesson_07 | Kasi pagod na ako. |
| **kaya** | I wonder / Perhaps / So | Particle | Lesson_07 | Sino kaya siya? |
| **lamang / lang** | Only / Just | Particle | Lesson_07 | Isa lang ang aklat. |
| **maaari** | May / Can (permission) | Pseudo-verb | Lesson_07 | Maaari ba akong umalis? |
| **magsalita** | To speak / Talk | Verb | Lesson_07 | Sila ay magsasalita sa radyo. |
| **magtiwala** | To trust | Verb | Lesson_07 | Magtiwala sa kaibigan. |
| **man** | Even / Even if | Particle | Lesson_07 | Kahit ano man. |
| **muna** | First / Beforehand | Particle | Lesson_07 | Kumain ka muna. |
| **na** | Already / Now | Particle | Lesson_07 | Aalis na ba sila? |
| **naman** | In contrast / On the other hand | Particle | Lesson_07 | Ikaw naman ang magsalita. |
| **nga** | Indeed / Really / Please | Particle | Lesson_07 | Oo nga, totoo iyan. |
| **pa** | Still / Yet / More | Particle | Lesson_07 | Marumi pa ba siya? |
| **pala** | So it turns out / By the way | Particle | Lesson_07 | Ikaw pala ang dumating! |
| **po / opo** | Respect particle / Yes (polite) | Particle | Lesson_07 | Opo, guro ako. |
| **puwede** | Can / Possible | Pseudo-verb | Lesson_07 | Puwede ba akong pumasok? |
| **radyo** | Radio | Noun | Lesson_07 | Magsalita sa radyo. |
| **sana** | Hopefully / I wish | Particle | Lesson_07 | Sana maganda ang panahon. |
| **tuloy** | Consequently / As a result | Particle | Lesson_07 | Nahuli tuloy kami. |
| **bughaw** | Blue | Adjective | Lesson_08 | Pinakabughaw na langit. |
| **galing / magaling** | Skill / Good / Excellent | Adjective / Noun | Lesson_08 | Magkasinggaling sina Rizal at Bonifacio. |
| **gaya** | Like / Similar to | Preposition | Lesson_08 | Si Maria ay maganda gaya ni Elena. |
| **higit / higit na** | More / Exceedingly | Adverb | Lesson_08 | Higit na marunong si Peter kaysa kay John. |
| **hindi kasing-** | Not as... as (inferiority) | Phrase / Prefix | Lesson_08 | Hindi kasinrunong si John ni Peter. |
| **ilog** | River | Noun | Lesson_08 | Pinakamalinaw na ilog. |
| **indayog** | Rhythm | Noun | Lesson_08 | Maganda ang indayog ng awit. |
| **istilo** | Style | Noun | Lesson_08 | Makabago ang istilo. |
| **kasing-** | As... as (equality prefix) | Prefix | Lesson_08 | Kasingganda ni Maria si Elena. |
| **kasin-** | As... as (before d, l, r, s, t) | Prefix | Lesson_08 | Kasindumi ng sapatos. |
| **kasim-** | As... as (before b, p) | Prefix | Lesson_08 | Kasimbait ng ina. |
| **katulad / tulad** | Similar to / Like | Preposition / Adjective | Lesson_08 | Katulad ng kapatid niya. |
| **kaysa / kaysa kay / kaysa sa** | Than (comparison) | Preposition | Lesson_08 | Mas masipag ang matanda kaysa sa bata. |
| **kesa** | Than (colloquial kaysa) | Preposition | Lesson_08 | Mas mabilis kesa sa kotse. |
| **kulot** | Curly | Adjective | Lesson_08 | Kasingkulot ng buhok mo. |
| **labis** | Excessive / Too much | Adjective / Adverb | Lesson_08 | Labis ang ganda. |
| **lakas / malakas** | Strength / Strong | Adjective / Noun | Lesson_08 | Pinakamalakas na lalaki. |
| **lalo / lalong** | Even more / Greater degree | Adverb | Lesson_08 | Lalong masipag si tatay. |
| **mabaho** | Foul-smelling / Stinky | Adjective | Lesson_08 | Magkasimbaho ang basura. |
| **mabigat** | Heavy | Adjective | Lesson_08 | Mabigat ang bakal. |
| **magkasing-** | Both equally... (prefix) | Prefix | Lesson_08 | Sina Maria at Elena ay magkasingganda. |
| **makabago** | Modern / Innovative | Adjective | Lesson_08 | Makabago ang istilo. |
| **malawak** | Broad / Vast | Adjective | Lesson_08 | Malawak ang dagat. |
| **mas** | More (comparative marker) | Particle / Adverb | Lesson_08 | Mas masipag si Helen. |
| **napaka-** | Very (intensive prefix) | Prefix | Lesson_08 | Napakaganda ng bulaklak. |
| **pareho** | Same / Both equal | Adjective / Adverb | Lesson_08 | Maganda pareho ni Elena. |
| **pinaka-** | Most / -est (superlative prefix) | Prefix | Lesson_08 | Pinakamalaking bahay. |
| **sing-** | As... as (short form prefix) | Prefix | Lesson_08 | Singtangkad mo siya. |
| **tono / boses** | Tone / Voice | Noun | Lesson_08 | Malawak ang tono ng boses. |
| **tugtugin** | Music piece / Tune | Noun | Lesson_08 | Maganda ang tugtugin. |
| **yelo** | Ice | Noun | Lesson_08 | Pinakamalamig na yelo. |

---

## 📗 SECTION 3: ACTIVITIES & EXERCISE BANK

This exercise bank is structured with unique IDs to be automatically loaded by an interactive quiz engine in the web application.

### 3.1 Articles and Word Order Exercises (Lesson 02)

#### `EX-L02-001` (Fill-in-the-blank — Proper Noun Articles)
* **Prompt**: Complete the sentence referring to Ruth and Peter (siblings): `___ Ruth at Peter ay magkapatid.`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Sina`
* **Grammar Explanation**: `Sina` is used because it precedes multiple proper names of people.

#### `EX-L02-002` (Fill-in-the-blank — Common Noun Articles)
* **Prompt**: Complete the sentence to say "The children are clean": `___ ___ bata ay malilinis.`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Ang mga`
* **Grammar Explanation**: The plural article for common nouns consists of `ang mga`.

#### `EX-L02-003` (Fill-in-the-blank — Place Article)
* **Prompt**: Complete the sentence: `___ Amerika at Aprika ay malalaki.`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Ang`
* **Grammar Explanation**: The article `ang` is used before place names. It is acceptable to omit the second `ang`.

#### `EX-L02-004` (Translation to Inverted Order)
* **Prompt**: Translate "The house is big" into inverted word order (predicate first, without *ay*).
* **Type**: `translation`
* **Correct Answer**: `Malaki ang bahay.`
* **Grammar Explanation**: In inverted order, the adjective (*Malaki*) comes first, followed by *ang bahay*. The word *ay* is dropped.

#### `EX-L02-005` (Translation — Subject-Predicate Order)
* **Prompt**: Translate "Peter is intelligent" using subject-predicate word order.
* **Type**: `translation`
* **Correct Answer**: `Si Peter ay marunong.`
* **Grammar Explanation**: In direct word order, `si` precedes the proper noun, followed by `ay` and the adjective.

#### `EX-L02-006` (Translation — Plural Adjective)
* **Prompt**: Translate "The shoes are clean" into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Ang mga sapatos ay malilinis.` / `Malilinis ang mga sapatos.`
* **Grammar Explanation**: `Malilinis` is the plural form of `malinis` (clean), formed by duplicating the first syllable.

---

### 3.2 Personal Pronoun Exercises (Lesson 03)

#### `EX-L03-001` (Translation — Exclusive vs Inclusive Pronouns)
* **Prompt**: Translate "We (exclusive) are studying Tagalog."
* **Type**: `translation`
* **Correct Answer**: `Kami ay nag-aaral ng Tagalog.` / `Nag-aaral ng Tagalog kami.`
* **Grammar Explanation**: `Kami` is used because it excludes the listener.

#### `EX-L03-002` (Translation — Post-Predicate Pronoun)
* **Prompt**: Translate "You are intelligent" using the post-predicate pronoun (*ka*).
* **Type**: `translation`
* **Correct Answer**: `Marunong ka.`
* **Grammar Explanation**: When placing the pronoun after the predicate, `Ikaw` is shortened to `ka`.

#### `EX-L03-003` (Translation — Polite Form)
* **Prompt**: Translate "Are you a teacher?" using the polite form with *po*.
* **Type**: `translation`
* **Correct Answer**: `Kayo po ba ay guro?`
* **Grammar Explanation**: The plural pronoun `kayo` with `po` expresses politeness when addressing a single person.

#### `EX-L03-004` (Translation — Plural Pronoun)
* **Prompt**: Translate "They are friends" into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Sila ay magkaibigan.` / `Magkaibigan sila.`
* **Grammar Explanation**: `Sila` is the plural 3rd-person pronoun meaning "they".

#### `EX-L03-005` (Pronoun Combination)
* **Prompt**: Combine the sentences: "Kayo ay bumili ng pagkain" (You plural bought food) + "Ako ay bumili ng pagkain" (I bought food) into one sentence.
* **Type**: `fill_in_blank`
* **Correct Answer**: `Tayo'y bumili ng pagkain.` / `Kami'y bumili ng pagkain.`
* **Grammar Explanation**: Combining "You (plural) + I" yields "We" (*Tayo* inclusive or *Kami* exclusive).

#### `EX-L03-006` (Translation — Inclusive We)
* **Prompt**: Translate "We (inclusive) are clean and good."
* **Type**: `translation`
* **Correct Answer**: `Tayo ay malilinis at mababait.` / `Malilinis at mababait tayo.`
* **Grammar Explanation**: `Tayo` includes both the speaker and the listener.

#### `EX-L03-007` (Translation — She is playing)
* **Prompt**: Translate "She is playing" into Tagalog using both word orders.
* **Type**: `translation`
* **Correct Answer**: `Siya ay naglalaro.` / `Naglalaro siya.`
* **Grammar Explanation**: `Siya` means he/she and `naglalaro` is the present tense of "to play".

#### `EX-L03-008` (Translation — They are healthy and intelligent)
* **Prompt**: Translate "They are healthy and intelligent" into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Sila ay malulusog at marurunong.` / `Malulusog at marurunong sila.`
* **Grammar Explanation**: Both adjectives take the plural form (duplicated first syllable) because the subject `sila` is plural.

---

### 3.3 Demonstrative & Ligature Exercises (Lesson 04)

#### `EX-L04-001` (Ligature Formula)
* **Prompt**: Apply the correct ligature to combine `mayaman` (rich) + `lalaki` (man).
* **Type**: `fill_in_blank`
* **Correct Answer**: `mayamang lalaki` / `lalaking mayaman`
* **Grammar Explanation**: Since `mayaman` ends in the consonant **N**, the suffix ligature `-g` is attached, producing `mayamang`.

#### `EX-L04-002` (Ligature Formula)
* **Prompt**: Apply the correct ligature to combine `malinis` (clean) + `pagkain` (food).
* **Type**: `fill_in_blank`
* **Correct Answer**: `malinis na pagkain` / `pagkaing malinis`
* **Grammar Explanation**: `Malinis` ends in the consonant **s** (not **n**), so the ligature word `na` is used between the two words.

#### `EX-L04-003` (Ligature Formula)
* **Prompt**: Apply the correct ligature to combine `marumi` (dirty) + `sapatos` (shoes).
* **Type**: `fill_in_blank`
* **Correct Answer**: `maruming sapatos` / `sapatos na marumi`
* **Grammar Explanation**: `Marumi` ends in a vowel (**i**), so the suffix `-ng` is attached.

#### `EX-L04-004` (Classroom Demonstrative)
* **Prompt**: Point to the desk in front of you (close to the speaker): `_____ ang aking lamesa.`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Ito` / `Ito'y`
* **Grammar Explanation**: `Ito` is used for objects near the speaker.

#### `EX-L04-005` (Ligature Formula)
* **Prompt**: Apply the correct ligature to combine `malakas` (strong) + `batang lalaki` (boy).
* **Type**: `fill_in_blank`
* **Correct Answer**: `malakas na batang lalaki` / `batang lalaking malakas`
* **Grammar Explanation**: `Malakas` ends in consonant **s** (not **n**), so `na` is used.

#### `EX-L04-006` (Ligature Formula)
* **Prompt**: Apply the correct ligature to combine `mataba` (fat) + `aso` (dog).
* **Type**: `fill_in_blank`
* **Correct Answer**: `matabang aso` / `asong mataba`
* **Grammar Explanation**: `Mataba` ends in vowel **a**, so the suffix `-ng` is attached.

---

### 3.4 Possessive Exercises (Lesson 05)

#### `EX-L05-001` (Proper Noun Possessive)
* **Prompt**: Translate "Peter's book is clean" into direct word order.
* **Type**: `translation`
* **Correct Answer**: `Ang aklat ni Peter ay malinis.`
* **Grammar Explanation**: The possessed object (*ang aklat*) comes first, followed by the proper possessive marker *ni* and the name *Peter*.

#### `EX-L05-002` (Post-Noun Possessive Pronoun)
* **Prompt**: Rewrite the sentence `Ang aking bahay ay malaki` using a post-noun possessive pronoun.
* **Type**: `translation`
* **Correct Answer**: `Ang bahay ko ay malaki.`
* **Grammar Explanation**: The pre-noun possessive pronoun `aking` changes to `ko` when placed after the noun.

#### `EX-L05-003` (Demonstrative Possessive)
* **Prompt**: Complete the sentence for "The dog of this person (near speaker) is intelligent": `Ang aso ____ ay marunong.`
* **Type**: `fill_in_blank`
* **Correct Answer**: `nito`
* **Grammar Explanation**: `Nito` is the possessive form of the demonstrative `ito` (of this).

#### `EX-L05-004` (Translation — Possessive)
* **Prompt**: Translate "The man's shoes are new" into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Ang sapatos ng lalaki ay bago.` / `Bago ang sapatos ng lalaki.`
* **Grammar Explanation**: `Ng lalaki` is the possessive form for a common noun (the man). The possessed object (*ang sapatos*) comes before the owner.

#### `EX-L05-005` (Translation — Possessive Pronoun)
* **Prompt**: Translate "Their house is big" into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Ang kanilang bahay ay malaki.` / `Ang bahay nila ay malaki.` / `Malaki ang bahay nila.`
* **Grammar Explanation**: `Kanilang` is the pre-noun form and `nila` is the post-noun form of the 3rd person plural possessive.

#### `EX-L05-006` (Translation — Possessive Pronoun)
* **Prompt**: Translate "My food is delicious" into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Ang aking pagkain ay masarap.` / `Ang pagkain ko ay masarap.` / `Masarap ang pagkain ko.`
* **Grammar Explanation**: `Aking` (pre-noun) or `ko` (post-noun) are the first person singular possessive forms.

---

### 3.5 Question Words Exercises (Lesson 06)

#### `EX-L06-001` (Fill-in-the-blank — Interrogative Pronoun Who)
* **Prompt**: Ask 'Who are you?' in Tagalog: `_____ ba kayo?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Sino` / `sino`
* **Grammar Explanation**: `Sino` is the interrogative pronoun used to ask 'who'.

#### `EX-L06-002` (Fill-in-the-blank — Interrogative Pronoun What)
* **Prompt**: Ask 'What is your name?' in Tagalog: `_____ ang pangalan mo?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Ano` / `ano` / `Anong` / `Ano'ng`
* **Grammar Explanation**: `Ano` means 'what' in Tagalog.

#### `EX-L06-003` (Translation — Specific Location Where)
* **Prompt**: Translate 'Where is the key?' into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Nasaan ang susi?` / `Nasaan ang susi`
* **Grammar Explanation**: `Nasaan` asks for the location or position of a specific item or person.

#### `EX-L06-004` (Fill-in-the-blank — Interrogative Price How Much)
* **Prompt**: Ask 'How much is the book?' in Tagalog: `_____ ang aklat?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Magkano` / `magkano`
* **Grammar Explanation**: `Magkano` is used to ask about price or monetary cost.

#### `EX-L06-005` (Translation — Interrogative Reason Why)
* **Prompt**: Translate 'Why are you angry?' into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Bakit ka galit?` / `Bakit ka galit` / `Bakit siya galit?`
* **Grammar Explanation**: `Bakit` asks for reasons or explanations behind an action or feeling.

#### `EX-L06-006` (Fill-in-the-blank — Plural Question Word What)
* **Prompt**: Ask for plural names ('What are your names?'): `_____ ang mga pangalan ninyo?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `Anu-ano` / `Anu-ano'y` / `anu-ano`
* **Grammar Explanation**: `Anu-ano` is the duplicated plural form of `ano` used when expecting plural answers.

---

### 3.6 Question Marker BA Exercises (Lesson 07)

#### `EX-L07-001` (Fill-in-the-blank — Question Marker Placement Direct Order)
* **Prompt**: Turn the statement "Sila ay aalis na" into a question: `Sila _____ ay aalis na?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `ba` / `ba'y`
* **Grammar Explanation**: In direct order, `ba` is placed immediately after the subject and before `ay`.

#### `EX-L07-002` (Fill-in-the-blank — Enclitic Monosyllable with BA)
* **Prompt**: Complete the question "Will you leave already?": `Aalis ka _____ _____?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `na ba`
* **Grammar Explanation**: The particle `na` (already) comes before `ba`, following the monosyllabic pronoun `ka`.

#### `EX-L07-003` (Fill-in-the-blank — Reported Speech Particle Daw vs Raw)
* **Prompt**: Complete the question "Is the child clean as they say?": `Malinis _____ ba ang bata?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `daw`
* **Grammar Explanation**: `Daw` is used after words ending in consonants (`malinis` ends in 's').

#### `EX-L07-004` (Fill-in-the-blank — Pseudo-Verb with BA and Ligature)
* **Prompt**: Ask "Does the child like to eat?": `Gusto _____ kumain ng bata?`
* **Type**: `fill_in_blank`
* **Correct Answer**: `bang` / `ba`
* **Grammar Explanation**: `Ba` combined with ligature `-ng` attaches to pseudo-verbs like `gusto` when preceding a main verb.

---

### 3.7 Comparison Exercises (Lesson 08)

#### `EX-L08-001` (Fill-in-the-blank — Equal Comparison Prefix)
* **Prompt**: Express "Maria is as beautiful as Elena": `Si Maria ay __________ ni Elena.` (Root: `ganda`)
* **Type**: `fill_in_blank`
* **Correct Answer**: `kasingganda` / `kasing-ganda`
* **Grammar Explanation**: `Kasing-` + root `ganda` expresses equality ("as beautiful as").

#### `EX-L08-002` (Fill-in-the-blank — Side-by-Side Equal Comparison)
* **Prompt**: Express "Maria and Elena are equally beautiful": `Sina Maria at Elena ay __________.` (Root: `ganda`)
* **Type**: `fill_in_blank`
* **Correct Answer**: `magkasingganda` / `magkasing-ganda`
* **Grammar Explanation**: `Magkasing-` is used when comparing two subjects side by side.

#### `EX-L08-003` (Translation — Superiority Comparison)
* **Prompt**: Translate "Peter is brighter than John" into Tagalog using `mas`.
* **Type**: `translation`
* **Correct Answer**: `Mas marunong si Peter kaysa kay John.` / `Si Peter ay mas marunong kaysa kay John.`
* **Grammar Explanation**: `Mas` + adjective + `kaysa kay` + [Person's name] expresses superiority.

#### `EX-L08-004` (Fill-in-the-blank — Superlative Degree)
* **Prompt**: Complete the sentence for "This mountain is the highest mountain": `Ang bundok na ito ang __________ na bundok.` (Root: `taas`)
* **Type**: `fill_in_blank`
* **Correct Answer**: `pinakamataas` / `pinaka-mataas`
* **Grammar Explanation**: The prefix `pinaka-` attached to `mataas` forms the superlative degree ("the highest").

---

## 📌 WEB GENERATOR ARCHITECTURE OVERVIEW

When building the web application generator script, the app features 3 core modules fed directly from this master document:

1. **Grammar Guide Module**: Interactive cards rendering rules, formulas, and contrasting tables from Section 1.
2. **Vocabulary Flashcards & Search**: Memory cards with audio/pronunciation, search filtering by part of speech and lesson origin from Section 2.
3. **Interactive Quiz & Test Center**: Dynamic test engine rendering fill-in-the-blank, multiple choice, and translation challenges with instant grading and grammar explanation notes from Section 3.
