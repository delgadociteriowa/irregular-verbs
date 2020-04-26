function app(initialState = {}) {
  setBaseScores(baseScore)
  const state = initialState

  return {
    setState(newState = state, stateClass, stateName) {
      return e => {
        const previousState = { ...state }
        Object.assign(state, { ...newState })
        render(previousState, { ...newState })
        addStateClass(stateClass)
        executeOnState(stateName)
        e.preventDefault()
      }
    }
  }
}

function render(previousState, newState) {
  if (previousState.content !== newState.content) {
    document.getElementById('content').innerHTML = newState.content()
  }
}

function addStateClass(stateClass) {
  if(content.classList.value.split(' ').length === 2) {
    content.classList.add(stateClass)
  } else {
    const lastClass = content.classList.value.split(" ").pop()
    content.classList.remove(lastClass)
    content.classList.add(stateClass)
  }
}

function executeOnState(stateName) {

  if(stateName === "home") {
    document.getElementById('home-how-to').addEventListener(
      'click',
      pageState.setState({
        content: howToComponent()
      }, 'pages', 'how-to')
    )
    document.getElementById('new-game').addEventListener(
      'click',
      pageState.setState({
        content: gameComponent()
      }, 'game', 'game')
    )
  }

  if(stateName === 'game'){
    Game.init()
  }
}

function setBaseScores(scores) {
  if(!localStorage.getItem( 'IVTopScores' )){
    localStorage.setItem('IVTopScores', JSON.stringify(scores))
  }
}

const baseScore = [
  {name: "John", score: 1, date:'04/25/2020 12:00'},
]

function renderScores() {
  const scores = JSON.parse(localStorage.getItem( 'IVTopScores' ))
  let scoresHTML = ''

  scores.forEach((score, i) => {
    scoresHTML += `
      <tr>
        <th scope="row">${i + 1}</th>
        <td>${score.name}</td>
        <td>${score.score}</td>
        <td>${score.date}</td>
      </tr>`
  })

  return scoresHTML
}

function homeComponent(props) {
  return () => `      
    <h1>IRREGULAR<br>VERBS</h1>
    <h2>Challenge Yourself!</h2>
    <hr>
    <a href="#" id="new-game" class="btn btn-primary btn-lg btn-block" role="button" aria-pressed="true">START NEW GAME</a>
    <a href="#" id="home-how-to" class="btn btn-info btn-lg btn-block" role="button" aria-pressed="true">HOW TO PLAY</a>
  `
}

function howToComponent(props) {
  return () => `
    <h2>HOW TO PLAY</h2>
    <div class="content-wrapper how-to">
      <p>
        At the "Home" page, click on the "START NEW GAME" button and it will redirect you to
        the game page.
        <br><br>
        At the top right corner, three hearts will be shown and they represent the failure
        opportunities (or "lives") you have during the game. Below the lives, you will see
        a 0 number, which increases in one point every time you answer correctly.
        <br><br>
        Then, at the center of the screen, a verb on its infinitive form will be shown,
         followed by two input fields below. The first should be filled with the shown verb
        but on its past tense form. The second one should be filled as well but on its past 
        participle form.        
        <br><br>
        Once you have filled these fields, the "CHECK" button below the fields will get 
        enabled so you can click on it to check your answers.
        <br><br>
        If both of your answers are right, you will recieve a point, but, in case
        just one of them is not right, you will loose an oportunity (a live).
        <br><br>
        The game ends when you don't have more lives or when there are no more verbs in the database 
        (which guarantees you the maximum possible punctuation). 
        <br><br>
        <h3>Other Details</h3>
        There are verbs that have more than one meaning and are written the same on their 
        infinitive form, but different in their past forms, whichever you use will be right 
        if it's well written.
        <br><br>
        The "Top Scores" page shows the last top 10 best scores. If you equal in points a friend 
        or yourself, that score will count as superior than the last one.
        The game has this behavior in order to maintain the feeling of challenge between your 
        friends and family.
      </p>
    </div>
  `
}

function topScoresComponent(props) {
  return () => `
    <h2>TOP SCORES</h2>
    <div class="content-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">NAME</th>
            <th scope="col">SCORE</th>
            <th scope="col">DATE</th>
          </tr>
        </thead>
        <tbody>
          ${props.scores}
        </tbody>
      </table>
    </div>
  `
}

function aboutComponent(props) {
  return () => `
    <h2>ABOUT</h2>
    <div class="content-wrapper how-to">
      <p>
        <strong>Irregular Verbs</strong> is a game that challenges your knowledge about
        these complex conjugations.
        <br><br>
        This game could help you as a tool for remembering verbs and for learning new ones.
        This game could come in handy in your path of becoming a very skilled bilingual.
        <br><br>
        Game made with javaScript by 
        <a target="_blank" href="http://www.delgadociterio.com">DELGADO/CITERIO</a>.
      </p>
    </div>
  `
}

function gameComponent(props) {
  return () => `
    <div id="g-lives" class="lives">
      <!--<i class="fas fa-heart-broken"></i>-->
    </div>
    <div id="g-points" class="points">
    </div>
    
    <div class="game-item">
      <label>INFINITIVE FORM</label>
      <h1 id="g-infinitive" class="infinitive-verb"></h1>
    </div>
    
    <form class="game-form">
      <div class="form-group">
        <label for="g-past-tense-input">PAST TENSE</label>
        <input class="form-control form-control-lg" id="g-past-tense-input">
        <div class="invalid-feedback">
          Enter just alphabet letters (more than just one and with no spaces)
        </div>
      </div>
      <div class="form-group">
        <label for="g-past-participle-input">PAST PARTICIPLE</label>
        <input class="form-control form-control-lg" id="g-past-participle-input">
        <div class="invalid-feedback">
          Enter just alphabet letters (more than just one and with no spaces)
        </div>
      </div>
    </form>

    <div id="g-alert" class="alert" role="alert"></div>

    <a href="#" class="btn btn-primary btn-lg btn-block disabled" id="g-submit">CHECK</a>

    <div class="modal fade" id="g-leaving-game" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white" id="exampleModalLongTitle">Irregular Verbs - Challenge Yourself!</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h4>Are you sure you want to <br> leave the current game?</h4>
            <br>
            <p>Your progress and score will not be saved.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-lg btn-block" id="g-leave-game">Leave current game</button>
            <button type="button" class="btn btn-secondary btn-lg btn-block" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="g-game-over" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-white" id="exampleModalLongTitle">Irregular Verbs - Challenge Yourself!</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h4>GAME OVER</h4>
            <p id="g-game-over-message"></p>
            <div id="g-game-over-form">
              <h4 class="text-primary">NEW RECORD!</h4>
              <form class="game-form">
                <div class="form-group">
                  <label for="g-player-name">ENTER YOUR NAME</label>
                  <input class="form-control form-control-lg" id="g-player-name">
                  <div class="invalid-feedback">
                    Enter more than 10 character and less than one (just letters and numbers are allowed)
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">

          <button type="button" class="btn btn-primary btn-lg btn-block" id="g-go-scores">CONTINUE</button>
          </div>
        </div>
      </div>
    </div>
  `
}

const pageState = app()

document.addEventListener(
  'DOMContentLoaded',
  pageState.setState({
    content: homeComponent()
  }, 'home', 'home')
)

const changePageState = function(e) {
  switch (e.target.id) {
    case 'home':
      pageState.setState({content: homeComponent()}, 'home', 'home')(e)
      break
    case 'home-brand':
      pageState.setState({content: homeComponent()}, 'home', 'home')(e)
      break
    case 'how-to':
      pageState.setState({content: howToComponent()}, 'pages', 'how-to')(e)
      break
    case 'top-scores':
      pageState.setState({content: topScoresComponent(
        { scores: renderScores() }
      )}, 'pages', 'top-scores')(e)
      break
    case 'about':
      pageState.setState({content: aboutComponent()}, 'pages', 'about')(e)
      break 
  }
}

document.getElementById('home').addEventListener('click', changePageState)
document.getElementById('home-brand').addEventListener('click', changePageState)
document.getElementById('how-to').addEventListener('click', changePageState)
document.getElementById('top-scores').addEventListener('click', changePageState)
document.getElementById('about').addEventListener('click', changePageState)



