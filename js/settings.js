export const renderSettings = () => {
  const container = document.createElement('div')
  container.classList.add(
    'container',
    'd-flex',
    'f-col',
    'f-align',
    'f-justify'
  )

  container.innerHTML = `
        <div class="paper border">
        <h2 class="text-center">Settings</h2>
        <h3>Categories</h3>
        <div class="row f-gap-sm mb-1">
          <input type="button" class="paper-btn btn-primary" data-id='18' value="Computer Science" />
          <input type="button" class="paper-btn btn-primary" data-id='11' value="Movies" />
          <input type="button" class="paper-btn btn-primary" data-id='10' value="Books" />
          <input type="button" class="paper-btn btn-primary" data-id='12' value="Music" />
          <input type="button" class="paper-btn btn-primary" data-id='15' value="Video Games" />
        </div>
        <fieldset class="form-group">
          <h3>Difficulty level</h3>
          <label for="paperRadios1" class="paper-radio">
            <input type="radio" name="difficulty" id="paperRadios1" value="easy"> <span>Easy</span>
          </label>
          <label for="paperRadios2" class="paper-radio">
            <input type="radio" name="difficulty" id="paperRadios2" value="medium"> <span>Medium</span>
          </label>
          <label for="paperRadios3" class="paper-radio">
            <input type="radio" name="difficulty" id="paperRadios3" value="hard"> <span>So hard</span>
          </label>
        </fieldset>
        <div class="d-flex f-justify-between">
          <button id="apply-btn">Apply</button>
          <button id="cancel-btn">
            Cancel
          </button>
        </div>
        </div>
  `

  let selectedCategory = {
    categoryName: null,
    categoryId: null,
  }

  // SELECT CATAGORY
  const categoryBtns = container.querySelectorAll('.paper-btn')

  categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach((btn) => btn.classList.remove('btn-secondary'))

      btn.classList.add('btn-secondary')

      selectedCategory.categoryName = btn.value
      selectedCategory.categoryId = btn.dataset.id
    })
  })

  // APPLY
  const applyBtn = container.querySelector('#apply-btn')

  applyBtn.addEventListener('click', () => {
    const input = container.querySelector('input[name="difficulty"]:checked')
    const inputText = input.closest('label').querySelector('span').textContent

    const settings = {
      category: selectedCategory,
      difficulty: {
        value: input.value,
        label: inputText,
      },
    }

    localStorage.setItem('quiz-settings', JSON.stringify(settings))
    window.location.hash = '#main-menu'
  })
  // CANCEL
  container.querySelector('#cancel-btn').addEventListener('click', () => {
    window.location.hash = '#main-menu'
  })

  return container
}
