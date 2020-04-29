const GameStorageCtrl = (function(){
	let scoresArray, scoresNumbers

	return{
		returnScoresArray: function() {
			return scores
		},

		returnScoresNumbers: function() {
			return scoresNumbers
		},

		registerNewRecord: function(newRecordObj) {
			let indexToReplace = null

			for(i = 0; i <= scoresArray.length - 1; i++){
				if(newRecordObj.score >= scoresArray[i].score) {
					indexToReplace = i
					break	
				}
			}

			if(indexToReplace !== null) {
				const lastIndex = scoresArray.length - 1
				for(j = lastIndex; j >= indexToReplace; j--) {
					scoresArray[j + 1] = scoresArray[j]					
				}
				scoresArray[indexToReplace] = newRecordObj
			} else {
				scoresArray.push(newRecordObj)
			}

			if(scoresArray.length > 10){
				scoresArray.pop()
			}

			localStorage.setItem('IVTopScores', JSON.stringify(scoresArray))
		},

		getVerbs: function(url) {
			return new Promise((resolve, reject) => {
		      fetch(url)
		      .then(res => res.json()) 
		      .then(data => resolve(data))
		      .catch(err => reject(err))
		    })
		},

		setScores: function() {
			scoresArray = JSON.parse(localStorage.getItem( 'IVTopScores' ))
			scoresNumbers = scoresArray.map(curr => curr.score)
		}
	}	
})()

const GameLogicCtrl = (function(){

	const baseLives = 3
	const basePoints = 0
	const baseTurn = 0

	let verbs

	const gameData = {
		lives: 3,
		points: 0,
		turn: 1
	}

	return {

		setVerbs: function(jsonVerbs) {
			verbs = jsonVerbs
		},

		shuffleAndFetchVerbsObject: function() {
			var currentIndex = verbs.length, temporaryValue, randomIndex

			while (0 !== currentIndex) {
				randomIndex = Math.floor(Math.random() * currentIndex)
				currentIndex -= 1
				temporaryValue = verbs[currentIndex]
				verbs[currentIndex] = verbs[randomIndex]
				verbs[randomIndex] = temporaryValue
			}
 			return verbs	
		},

		fetchTurnVerb: function() {
			return verbs[gameData.turn]
		},

		fetchGameDataObject: function() {
			return gameData
		},

		fetchVerbsLength: function() {
			return verbs.length
		},

		checkVerbs: function() {
			const pastTenseInput = document.querySelector('#g-past-tense-input')
			const pastParticipleInput = document.querySelector('#g-past-participle-input')
			const pastTenseByUser = pastTenseInput.value.toLowerCase()
			const pastParticipleByUser = pastParticipleInput.value.toLowerCase()
			const turnVerb = verbs[gameData.turn]
			const pastTenseRightOptions = turnVerb.pastTense
			const pastParticipleRightOptions = turnVerb.pastParticiple
			let pastTenseRight = false
			let pastParticipleRight = false

			pastTenseRightOptions.forEach((valid) => {
				if(valid === pastTenseByUser) {
					pastTenseRight = true
				}
			})

			pastParticipleRightOptions.forEach((valid) => {
				if(valid === pastParticipleByUser) {
					pastParticipleRight = true
				}
			})

			if(pastTenseRight === true && pastParticipleRight === true) {
				return true
			} else {
				return false
			}
		},

		addPoint: function() {
			gameData.points++
		},

		removeALive: function() {
			gameData.lives--
		},

		addTurn: function() {
			gameData.turn++
		},

		resetGameData: function() {
			gameData.lives = baseLives,
			gameData.points = basePoints,
			gameData.turn = baseTurn
		},

		gameIsOver: function() {
			if((gameData.turn === verbs.length) || (gameData.lives === 0)) {
				return true
			} else {
				return false
			}
		},

		newRecord: function(arrayOfScores, button){
			if(gameData.points === 0) {
				button.newRecord = false
				return false
			} else {
				if(!(arrayOfScores.length === 10)) {
					button.newRecord = true
					return true
				} else {
					let isRecord = false
					for(i = 0; i <= arrayOfScores.length; i++){
						if(gameData.points >= arrayOfScores[i])
						{
							isRecord = true
							break
						}
					}
					button.newRecord = isRecord
					return isRecord
				}
			}
		},

		createNewRecordObj: function(name, score){
			const date = new Date()
			const month = date.getMonth() + 1
			const day = date.getDate()
			const year = date.getFullYear()
			const hour = date.getHours()
			const minutes = date.getMinutes()
			const sMonth = month.toString().length === 1 ? '0'+month.toString() : month.toString()
			const sDay = day.toString().length === 1 ? '0'+day.toString() : day.toString()
			const sYear = year.toString()
			const sHour = hour.toString().length === 1 ? '0'+hour.toString() : hour.toString()
			const sMinutes = minutes.toString().length === 1 ? '0'+minutes.toString() : minutes.toString()
			const recordObject = {name:'', score:'', date:''}

			recordObject.name = name
			recordObject.score = score
			recordObject.date = `${sMonth}/${sDay}/${sYear} ${sHour}:${sMinutes}`			

			return recordObject
		}

	}
})()

const GameUICtrl = (function(){
	return {

		renderInfinitive: function(verb){
			document.querySelector('#g-infinitive').textContent = verb
		},

		hideAlert: function(){
			document.querySelector('#g-alert').style.visibility = 'hidden'
		},

		showAlert: function(msg, alertType){
			const alert = document.querySelector('#g-alert') 
			alert.style.visibility = 'visible'
			alert.textContent = msg
			alert.classList.add(alertType)
			
			if(alertType === "alert-success"){
				alert.classList.remove('alert-danger')
			} else {
				alert.classList.remove('alert-success')			
			}
		},

		renderLives: function(lives){
			let hearts = ''

			for (i = 1; i <= lives; i++) {
			  hearts += '<i class="fas fa-heart"></i> '
			}

      		document.querySelector('#g-lives').innerHTML = hearts
		},

		renderLifeSubstraction: function() {
			const livesTags = document.querySelector('#g-lives').children
			for(i = 0; i <= livesTags.length; i++){
				if(livesTags[i].classList[1] === 'fa-heart') {
					livesTags[i].classList.remove('fa-heart')
					livesTags[i].classList.add('fa-heart-broken')
					break
				}
			}
		},

		renderPoints: function(points){
			document.querySelector('#g-points').textContent = points
		},

		showLeavingModal: function(e){
			document.querySelector('#g-leave-game').irregularVerbsState = e.target.id
			$('#g-leaving-game').modal('show')
		},

		validateInputVerbs: function(e){
		  const re = /^[a-zA-Z]{2,}$/
		  if(e.target.value !== ''){
			  if(!re.test(e.target.value)){
			    e.target.classList.add('is-invalid')
			  } else {
			    e.target.classList.remove('is-invalid')
			  }
		  }
		},

		validateInputName: function(e){
		  const re = /^[a-zA-Z0-9]{2,10}$/
		  if(e.target.value !== ''){
			  if(!re.test(e.target.value)){
			    e.target.classList.add('is-invalid')
			  } else {
			    e.target.classList.remove('is-invalid')
			  }
		  }
		},

		disableVerbInputs: function(){
			document.querySelector('#g-past-tense-input').setAttribute('disabled','')
			document.querySelector('#g-past-participle-input').setAttribute('disabled','')
		},

		enableVerbInputs: function(){
			document.querySelector('#g-past-tense-input').removeAttribute('disabled')
			document.querySelector('#g-past-participle-input').removeAttribute('disabled')
		},

		clearFields: function(){
			document.querySelector('#g-past-tense-input').value = ''
			document.querySelector('#g-past-participle-input').value = ''
		},

		hideAlert: function() {
			document.querySelector('#g-alert').style.visibility = 'hidden'
		},

		setNextButton: function(){
			document.querySelector('#g-submit').classList.remove('btn-primary')
			document.querySelector('#g-submit').classList.add('btn-success') 
			document.querySelector('#g-submit').innerHTML = 'NEXT VERB'
		},

		setCheckButton: function(){
			document.querySelector('#g-submit').classList.remove('btn-success')
			document.querySelector('#g-submit').classList.add('btn-primary') 
			document.querySelector('#g-submit').innerHTML = 'CHECK'
			document.querySelector('#g-submit').classList.add('disabled')
		},

		focusFirstField: function(){
			if(window.innerWidth > 830){
				document.querySelector('#g-past-tense-input').focus()
			}
		},

		enableSubmit: function(){
			const re = /^[a-zA-Z]{2,}$/
			const pastTense = document.querySelector('#g-past-tense-input').value
			const pastParticiple = document.querySelector('#g-past-participle-input').value
			const submit = document.querySelector('#g-submit')

			if(re.test(pastTense) && re.test(pastParticiple)) {
				submit.classList.remove('disabled')
			} else {
				submit.classList.add('disabled')
			}
		},

		enableUsernameSubmit: function(){
			const re = /^[a-zA-Z0-9]{2,10}$/
			const gPlayerName = document.querySelector('#g-player-name').value
			const gGoScores = document.querySelector('#g-go-scores')
			if(re.test(gPlayerName)) {
				gGoScores.classList.remove('disabled')
			} else {
				gGoScores.classList.add('disabled')
			}
		},

		showGameOverModal: function(msg){
			document.querySelector('#g-game-over-message').textContent = msg
			$('#g-game-over').modal('show')
		},

		gameIsOverRecordForm: function(newRecord){
			const goScoresBtn = document.querySelector('#g-go-scores')
			const playerNaameInput = document.querySelector('#g-player-name')
			const gameOverForm = document.querySelector('#g-game-over-form')
			if(newRecord) {
				goScoresBtn.classList.remove('btn-primary')
				goScoresBtn.classList.add('btn-success')
				goScoresBtn.classList.add('disabled')
			} else {
				gameOverForm.style.display = 'none'
			}
		}

	}
})()

const Game = (function(GameUICtrl, GameLogicCtrl, GameStorageCtrl){

	const reassignMenuEvents = function(typeOfReassign = 'on-game') {
		const pages = ['#home','#home-brand','#how-to','#top-scores','#about']
		if(typeOfReassign === 'leave') {
			pages.forEach( page => {
				document.querySelector( page ).removeEventListener('click', GameUICtrl.showLeavingModal)
				document.querySelector( page ).addEventListener('click', changePageState)
			})
		} else {
			pages.forEach( page => {
				document.querySelector( page ).removeEventListener('click', changePageState)
				document.querySelector( page ).addEventListener('click', GameUICtrl.showLeavingModal)	
			})
		}
	}

	const loadEventListeners = function() {
		reassignMenuEvents()

		document.querySelector('#g-leave-game').addEventListener('click', leaveGame)
    	document.querySelector('#g-past-tense-input').addEventListener('keyup', GameUICtrl.validateInputVerbs)
    	document.querySelector('#g-past-participle-input').addEventListener('keyup', GameUICtrl.validateInputVerbs)
    	document.querySelector('#g-player-name').addEventListener('keyup', GameUICtrl.validateInputName)
		document.querySelector('#g-past-tense-input').addEventListener('keyup', GameUICtrl.enableSubmit)
		document.querySelector('#g-past-participle-input').addEventListener('keyup', GameUICtrl.enableSubmit)
		document.querySelector('#g-player-name').addEventListener('keyup', GameUICtrl.enableUsernameSubmit)
		document.querySelector('#g-submit').addEventListener('click', clickOnSubmit)
		document.querySelector('#g-go-scores').addEventListener('click', clickOnGoScores)

		$('#g-game-over').on('shown.bs.modal', function () {
			if(document.querySelector('#g-go-scores').newRecord) {
				if(window.innerWidth > 830){
					$('#g-player-name').focus()
				}
			} else {
				if(window.innerWidth > 830){
					$('#g-go-scores').focus()
				}
			}
		})
	}

	const leaveGame = function(e) {
		reassignMenuEvents('leave')
		$('#g-leaving-game').modal('hide')

		switch (e.target.irregularVerbsState) {
			case 'home':
			  pageState.setState({content: homeComponent()}, 'home', 'home')(e)
			  document.querySelector("#navbarSupportedContent").classList.remove("show")
			  break
			case 'home-brand':
			  pageState.setState({content: homeComponent()}, 'home', 'home')(e)
			  document.querySelector("#navbarSupportedContent").classList.remove("show")
			  break
			case 'how-to':
			  pageState.setState({content: howToComponent()}, 'pages', 'how-to')(e)
			  document.querySelector("#navbarSupportedContent").classList.remove("show")
			  break
			case 'top-scores':
			  pageState.setState({content: topScoresComponent(
			  	{ scores: renderScores() }
			  )}, 'pages', 'top-scores')(e)
			  document.querySelector("#navbarSupportedContent").classList.remove("show")
			  break
			case 'about':
			  pageState.setState({content: aboutComponent()}, 'pages', 'about')(e)
			  document.querySelector("#navbarSupportedContent").classList.remove("show")
			  break 
		}
	}

	const clickOnSubmit = function() {
		const buttonWord = document.querySelector('#g-submit').innerHTML.toLowerCase()
		if(buttonWord === 'check') {
			clickOnCheck()
		} else {
			clickOnNextVerb()
		}
	}

	const clickOnCheck = function() {
		const gGoScores = document.querySelector('#g-go-scores')
		GameUICtrl.disableVerbInputs()

		if(GameLogicCtrl.checkVerbs()){
			GameLogicCtrl.addTurn()
			GameLogicCtrl.addPoint()		
			GameUICtrl.renderPoints(GameLogicCtrl.fetchGameDataObject().points)

			if(GameLogicCtrl.gameIsOver()){
				GameUICtrl.showGameOverModal('We don\'t have more verbs in our database!')
				GameUICtrl.gameIsOverRecordForm(
					GameLogicCtrl.newRecord(
						GameStorageCtrl.returnScoresNumbers(),
						gGoScores))
			} else {
				GameUICtrl.showAlert('You are right! You get 1 point :)', 'alert-success')
				GameUICtrl.setNextButton()
			}

		} else {
			GameLogicCtrl.addTurn()
			GameLogicCtrl.removeALive()
			GameUICtrl.renderLifeSubstraction()

			if(GameLogicCtrl.gameIsOver()){
				GameUICtrl.showGameOverModal('You don\'t have more lives :(')
				GameUICtrl.gameIsOverRecordForm(
					GameLogicCtrl.newRecord(
						GameStorageCtrl.returnScoresNumbers(),
						gGoScores))
			} else {
				const playerLives = GameLogicCtrl.fetchGameDataObject().lives

				if(playerLives === 1){
					GameUICtrl.showAlert(`You are wrong, you have ${playerLives} live left`, 'alert-danger')
				} else {
					GameUICtrl.showAlert(`You are wrong, you have ${playerLives} lives left`, 'alert-danger')
				}

				GameUICtrl.setNextButton()
			}

		}
	}

	const clickOnNextVerb = function() {
		GameUICtrl.renderInfinitive(GameLogicCtrl.fetchTurnVerb().infinitive)
		GameUICtrl.clearFields()
		GameUICtrl.hideAlert()
		GameUICtrl.enableVerbInputs()
		GameUICtrl.setCheckButton()
		GameUICtrl.focusFirstField()
	}

	const clickOnGoScores = function(e) {
		const gGoScores = document.querySelector("#g-go-scores")
		if(gGoScores.newRecord){
			const gPlayerName = document.querySelector("#g-player-name").value
			const points = GameLogicCtrl.fetchGameDataObject().points
			const newRecordObj = GameLogicCtrl.createNewRecordObj(gPlayerName,points)
			GameStorageCtrl.registerNewRecord(newRecordObj)
			$('#g-game-over').modal('hide')
			reassignMenuEvents('leave')
			pageState.setState({content: topScoresComponent({ scores: renderScores() })}, 'pages', 'top-scores')()
		} else {
			$('#g-game-over').modal('hide')
			reassignMenuEvents('leave')
			pageState.setState({content: topScoresComponent({ scores: renderScores() })}, 'pages', 'top-scores')()
		}
		e.preventDefault()
	}

	return {
		init: function(){
			console.log('Verbs Game Ready!')

			function initGameAfterData() {
				GameStorageCtrl.setScores();
				GameLogicCtrl.resetGameData()
				const verbs = GameLogicCtrl.shuffleAndFetchVerbsObject()
	      		const gameData = GameLogicCtrl.fetchGameDataObject()
				GameUICtrl.renderInfinitive(verbs[gameData.turn].infinitive)
				GameUICtrl.renderLives(gameData.lives)
				GameUICtrl.renderPoints(gameData.points)
				GameUICtrl.hideAlert()
				GameUICtrl.focusFirstField()
	      		loadEventListeners()
			}

			GameStorageCtrl.getVerbs('./js/irregular-verbs.json')
				.then(data => {
					GameLogicCtrl.setVerbs(data)
					initGameAfterData()
				})
				.catch(err => console.log(err))
		}
	}

})(GameUICtrl, GameLogicCtrl, GameStorageCtrl)



