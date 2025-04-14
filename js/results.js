export const renderResults = () => {
  const container = document.createElement('div')

  container.classList.add('container', 'd-flex', 'f-col', 'f-justify')

  const quizResult = JSON.parse(localStorage.getItem('quiz-results')) || []
  const correctQuestions = quizResult.filter((a) => a.isCorrect).length

  container.innerHTML = `<div class="paper border">
    <h3 class="text-center">Results</h3>
    <h4 class="text-center">${correctQuestions}/${quizResult.length} correct</h4>
    <div class="d-flex f-gap-lg f-justify-between">
        <button id="try-again">Try Again</button>
        <button id="return-menu">Back to Menu</button>
    </div>
  </div>
  `
  const tryAgainBtn = container.querySelector('#try-again')
  const returnMenuBtn = container.querySelector('#return-menu')

  tryAgainBtn.addEventListener('click', () => {
    localStorage.removeItem('quiz-results')
    window.location.hash = '#quiz'
  })

  returnMenuBtn.addEventListener('click', () => {
    window.location.hash = '#main-menu'
  })

  return container
}
