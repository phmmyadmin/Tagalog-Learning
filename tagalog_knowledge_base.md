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
    "lessons_covered": ["Lesson_02", "Lesson_03", "Lesson_04", "Lesson_05"],
    "total_vocab_terms": 95,
    "total_grammar_topics": 8,
    "total_exercises": 30,
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
        {"ligature": "-ng", "condition": "Noun + Noun sequence", "example": "bata + babae -> batang babae (young girl)"},
        {"ligature": "na", "condition": "Verb + Adjective / Adjective + Verb", "example": "pagod + dumating -> pagod na dumating (arrived tired)"},
        {"ligature": "-g", "condition": "Verb + Adverb sequence", "example": "kumain + mabilis -> kumaing mabilis (ate quickly)"},
        {"ligature": "na", "condition": "Repeated adjective for superlative", "example": "mabait + mabait -> mabait na mabait (very kind)"},
        {"ligature": "rule", "condition": "Multiple adjectives before a noun", "example": "Only the LAST adjective takes the ligature: mabait at masunuring aso"}
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

#### `EX-L05-006` (Translation — Possessive)
* **Prompt**: Translate "My food is delicious" into Tagalog.
* **Type**: `translation`
* **Correct Answer**: `Ang aking pagkain ay masarap.` / `Ang pagkain ko ay masarap.` / `Masarap ang pagkain ko.`
* **Grammar Explanation**: `Aking` (pre-noun) or `ko` (post-noun) are the first person singular possessive forms.

---

## 📌 WEB GENERATOR ARCHITECTURE OVERVIEW

When building the web application generator script, the app features 3 core modules fed directly from this master document:

1. **Grammar Guide Module**: Interactive cards rendering rules, formulas, and contrasting tables from Section 1.
2. **Vocabulary Flashcards & Search**: Memory cards with audio/pronunciation, search filtering by part of speech and lesson origin from Section 2.
3. **Interactive Quiz & Test Center**: Dynamic test engine rendering fill-in-the-blank, multiple choice, and translation challenges with instant grading and grammar explanation notes from Section 3.
