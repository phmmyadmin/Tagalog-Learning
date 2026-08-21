import defaultQuiz from './generated_quiz.json';
import pronounsQuiz from './pronouns_quiz.json';
import verbsQuiz from './verbs_quiz.json';

import lesson02Quiz from './lesson_02_quiz.json';
import lesson03Quiz from './lesson_03_quiz.json';
import lesson04Quiz from './lesson_04_quiz.json';
import lesson05Quiz from './lesson_05_quiz.json';
import lesson06Quiz from './lesson_06_quiz.json';
import lesson07Quiz from './lesson_07_quiz.json';
import lesson08Quiz from './lesson_08_quiz.json';

export const lessonQuizzes = [
  lesson02Quiz,
  lesson03Quiz,
  lesson04Quiz,
  lesson05Quiz,
  lesson06Quiz,
  lesson07Quiz,
  lesson08Quiz,
];

export const availableQuizzes = [
  defaultQuiz,
  pronounsQuiz,
  verbsQuiz,
  ...lessonQuizzes,
];
