/**
 * Utility functions for answer validation
 */

/**
 * Determine if a submission result indicates a correct answer
 * @param resultData - The result data from the submission API
 * @returns Object containing correctness information and details
 */
export function analyzeSubmissionResult(resultData: {
  xp: number;
  message: string;
  // Add other fields as needed
}) {
  // Parse the message to extract correctness information
  // Expected format: "Correct: X/Y" where X is newly correct count, Y is total questions
  const match = resultData.message.match(/Correct: (\d+)\/(\d+)/);
  
  if (!match) {
    // If we can't parse the message, fall back to XP-based determination
    return {
      isCorrect: resultData.xp > 0, // Positive XP usually means correct
      isNewlyCorrect: resultData.xp > 0,
      correctCount: 0,
      totalCount: 1,
      messageParsed: false
    };
  }
  
  const correctCount = parseInt(match[1], 10);
  const totalCount = parseInt(match[2], 10);
  
  return {
    isCorrect: correctCount >= 0, // Any non-negative count means answer was processed (0 means already correct)
    isNewlyCorrect: correctCount > 0, // Positive count means newly correct
    correctCount,
    totalCount,
    messageParsed: true
  };
}

/**
 * Validate if a user's answer matches the expected answer
 * This function should be used server-side where we have access to correct answers
 * @param userAnswer - The answer provided by the user
 * @param correctAnswer - The correct answer from the database
 * @returns boolean indicating if the answer is correct
 */
export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  // Normalize both answers by trimming whitespace
  const normalizedUserAnswer = userAnswer.trim();
  const normalizedCorrectAnswer = correctAnswer.trim();
  
  // Handle potentially quoted answers in database
  let cleanCorrectAnswer = normalizedCorrectAnswer;
  if (normalizedCorrectAnswer.startsWith('"') && normalizedCorrectAnswer.endsWith('"')) {
    cleanCorrectAnswer = normalizedCorrectAnswer.slice(1, -1);
  }
  
  // Compare the answers
  return normalizedUserAnswer === cleanCorrectAnswer;
}