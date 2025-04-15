export const renderMainMenu = () => {
  const container = document.createElement('div')

  const quizSettings = JSON.parse(localStorage.getItem('quiz-settings')) || {}
  const categoryName = quizSettings?.category?.categoryName || 'Not set'
  const difficultyName = quizSettings?.difficulty?.label || 'Not set'

  container.classList.add(
    'container',
    'd-flex',
    'f-col',
    'f-align',
    'f-justify'
  )

  container.innerHTML = `<h1>
    Tiny Quiz
    <span class="badge" style="width: 3rem; font-size: 1rem">beta</span>
  </h1>
  <div class="d-flex mb-1 btn-container">
    <button id="start-btn" popover-left="Test your knowledge!">
      Start
    </button>
    <button
      id="settings-btn"
      popover-right="Set category and difficulty level"
    >
      Settings
    </button>
  </div>
  <div class='alert-box'></div>
  <div class="d-flex f-gap-sm">
    <p>Category: <span id="category">${categoryName}</span></p>
    <p>Difficulty: <span id="difficulty">${difficultyName}</span></p>
  </div>`

  container.querySelector('#start-btn').addEventListener('click', () => {
    const hasSettings =
      quizSettings.category?.categoryId && quizSettings.difficulty?.label

    if (!hasSettings) {
      const alertBox = container.querySelector('.alert-box')

      alertBox.innerHTML = ''

      const alert = document.createElement('div')
      alert.classList.add('alert', 'alert-danger')
      alert.textContent =
        'Please set the category and difficulty level in the settings.'
      alertBox.appendChild(alert)

      setTimeout(() => {
        alert.remove()
      }, 5000)

      return
    }

    window.location.hash = '#quiz'
  })

  container.querySelector('#settings-btn').addEventListener('click', () => {
    window.location.hash = '#settings'
  })

  return container
}
