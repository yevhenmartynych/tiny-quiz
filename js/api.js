export const getQuestionKey = ({ category, difficulty }) => {
  return `quiz-questions-${category.categoryId}-${difficulty.value}`
}

export const fetchQuestions = async ({ category, difficulty }) => {
  const questionKey = getQuestionKey({ category, difficulty })
  const cachedQuestions = localStorage.getItem(questionKey)

  if (cachedQuestions) {
    return JSON.parse(cachedQuestions)
  }

  const url = `https://opentdb.com/api.php?amount=10&category=${category.categoryId}&difficulty=${difficulty.value}&type=multiple`
  const response = await fetch(url)
  const data = await response.json()

  localStorage.setItem(questionKey, JSON.stringify(data.results))

  return data.results
}
