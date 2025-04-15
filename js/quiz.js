import { fetchQuestions } from './api.js'
import { decodeHtmlEntities, shuffleArray, showConfetti } from './utils.js'

export class Quiz {
  constructor(questionKey) {
    this.questionKey = questionKey
    this.currentIndex =
      parseInt(localStorage.getItem(`${questionKey}-currentIndex`)) || 0
    this.questions = []
    this.userAnswers = []
    this.container = document.getElementById('app')
    this.isQuizOver = false

    const savedSettings =
      JSON.parse(localStorage.getItem('quiz-settings')) || {}
    this.settings = savedSettings

    this.quizContainer = document.createElement('div')
    this.quizContainer.classList.add(
      'container',
      'd-flex',
      'f-col',
      'f-justify'
    )
    this.container.appendChild(this.quizContainer)
  }

  async loadQuestions() {
    const cached = localStorage.getItem(this.questionKey)
    if (cached) {
      this.questions = JSON.parse(cached)
      // If questions don't have shuffled answers, add them
      if (!this.questions[0].shuffledAnswers) {
        this.questions = this.questions.map((question) => ({
          ...question,
          shuffledAnswers: shuffleArray([
            ...question.incorrect_answers,
            question.correct_answer,
          ]).map(decodeHtmlEntities),
        }))
        localStorage.setItem(this.questionKey, JSON.stringify(this.questions))
      }
      return
    }

    const { category, difficulty } = this.settings

    try {
      const data = await fetchQuestions({ category, difficulty })
      this.questions = data.map((question) => ({
        ...question,
        shuffledAnswers: shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer,
        ]).map(decodeHtmlEntities),
      }))
      localStorage.setItem(this.questionKey, JSON.stringify(this.questions))
    } catch (error) {
      console.error('error fetching questions:', error)
    }
  }

  renderQuestionTitle() {
    const questionTitle = document.createElement('h3')
    questionTitle.classList.add('text-center')
    questionTitle.textContent = `Question ${this.currentIndex + 1} of ${
      this.questions.length
    }`
    return questionTitle
  }

  renderQuestionText(currentQuestion) {
    const questionText = document.createElement('h4')
    questionText.textContent = decodeHtmlEntities(currentQuestion.question)
    return questionText
  }

  renderAnswers() {
    const allAnswers = this.questions[this.currentIndex].shuffledAnswers

    const answersContainer = document.createElement('fieldset')
    answersContainer.classList.add(
      'form-group',
      'd-flex',
      'f-col',
      'f-align-start'
    )

    const renderQuestionAnswer = allAnswers
      .map(
        (answer, index) => `<label for="paperChecks${
          index + 1
        }" class="paper-check">
      <input
        type="radio"
        name="paperChecks"
        id="paperChecks${index + 1}"
        value="${answer}"
      />
      <span>${answer}</span>
    </label>`
      )
      .join('')

    answersContainer.innerHTML = `<legend>Your answer:</legend>
      ${renderQuestionAnswer}`

    return answersContainer
  }

  renderControls(currentQuestion) {
    const controls = document.createElement('div')
    controls.classList.add('d-flex', 'f-justify-between')

    // prev button
    if (this.currentIndex > 0) {
      const prevBtn = document.createElement('button')
      prevBtn.textContent = 'Prev'
      prevBtn.addEventListener('click', () => {
        this.currentIndex--
        this.renderQuiz()
      })
      controls.appendChild(prevBtn)
    } else {
      controls.appendChild(document.createElement('span'))
    }

    // center information: category and difficulty
    const centerInfo = document.createElement('div')
    centerInfo.classList.add('d-flex', 'f-gap-lg')
    centerInfo.innerHTML = `<p>Category: ${this.settings.category.categoryName}</p>
            <p>Difficulty: ${this.settings.difficulty.label}</p>`
    controls.appendChild(centerInfo)

    // next/finish button
    const nextBtn = document.createElement('button')
    nextBtn.textContent =
      this.currentIndex === this.questions.length - 1 ? 'Finish' : 'Next'
    nextBtn.addEventListener('click', () => {
      const selectedAnswer = document.querySelector(
        'input[name="paperChecks"]:checked'
      )

      if (!selectedAnswer) {
        alert('Please select an answer')
        return
      }

      // save user answer
      this.userAnswers.push({
        question: decodeHtmlEntities(currentQuestion.question),
        selectedAnswer: selectedAnswer.value,
        correctAnswer: decodeHtmlEntities(currentQuestion.correct_answer),
        isCorrect: selectedAnswer.value === currentQuestion.correct_answer,
      })

      if (nextBtn.textContent === 'Finish') {
        showConfetti()
      }

      if (this.currentIndex === this.questions.length - 1) {
        this.isQuizOver = true
        localStorage.removeItem(`${this.questionKey}-currentIndex`)
        this.showResults()
        return
      }

      this.currentIndex++
      localStorage.setItem(
        `${this.questionKey}-currentIndex`,
        this.currentIndex
      )
      this.renderQuiz()
    })

    controls.appendChild(nextBtn)

    return controls
  }

  renderQuiz() {
    const currentQuestion = this.questions[this.currentIndex]

    this.quizContainer.innerHTML = ``

    // render question container
    const questionContainer = document.createElement('div')
    questionContainer.classList.add('paper', 'border')

    questionContainer.appendChild(this.renderQuestionTitle())
    questionContainer.appendChild(this.renderQuestionText(currentQuestion))
    questionContainer.appendChild(this.renderAnswers())
    questionContainer.appendChild(this.renderControls(currentQuestion))

    this.quizContainer.appendChild(questionContainer)
  }

  showResults() {
    localStorage.setItem('quiz-results', JSON.stringify(this.userAnswers))
    window.location.hash = '#results'
  }
}
