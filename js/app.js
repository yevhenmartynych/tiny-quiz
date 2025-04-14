import { renderMainMenu } from './menu.js'
import { renderSettings } from './settings.js'
import { Quiz } from './quiz.js'
import { renderResults } from './results.js'
import { getQuestionKey } from './api.js'
import { cleanAppContainer } from './utils.js'

function renderAppRoute() {
  cleanAppContainer()

  const route = window.location.hash || '#main-menu'

  const app = document.querySelector('#app')

  let screen = null

  if (route === '#main-menu') {
    screen = renderMainMenu()
  } else if (route === '#settings') {
    screen = renderSettings()
  } else if (route === '#quiz') {
    renderQuiz()
    return
  } else if (route === '#results') {
    screen = renderResults()
  } else {
    screen = renderMainMenu()
  }

  app.appendChild(screen)
}

async function renderQuiz() {
  cleanAppContainer()

  const quizSettings = JSON.parse(localStorage.getItem('quiz-settings'))
  const questionKey = getQuestionKey(quizSettings)
  const quiz = new Quiz(questionKey)
  await quiz.loadQuestions()
  quiz.renderQuiz()
}

window.addEventListener('hashchange', renderAppRoute)
window.addEventListener('DOMContentLoaded', renderAppRoute)
