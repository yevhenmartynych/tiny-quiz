// Decode HTML entities in a string
export function decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value.replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

// Shuffle quiz answers
export function shuffleArray(array) {
  const shuffledArray = [...array]
  shuffledArray.sort(() => Math.random() - 0.5)
  return shuffledArray
}

// Clean app container

export function cleanAppContainer() {
  const app = document.getElementById('app')
  app.innerHTML = ''
}
