let deckId
let scorePlayerOne = 0
let scorePlayerTwo = 0
const deckOne = document.getElementById('card1')
const deckTwo = document.getElementById('card2')
const cardsContainer = document.getElementById('cards')
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const restartGameBtn = document.getElementById('restart-game')
const gameText = document.getElementById('game-text')
const heroText = document.getElementById('hero-text')
const healthBar = document.getElementById('healthBar')
const numberOfCards = document.getElementById('numberOfCards')
const currentHealthOne = document.getElementById('current-health1')
const currentHealthTwo = document.getElementById('current-health2')


// Uses deckofcards API to create the deck and show the game informatio like health etc.
newDeckBtn.addEventListener("click", handleClick)
function handleClick() {

    heroText.style.display = 'none'
    newDeckBtn.style.display = 'none'
    drawCardBtn.style.display = 'block'

    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            console.log(data)
            deckId = data.deck_id
            cardsContainer.style.display = "block"
            healthBar.style.display = "block"
            gameText.style.display = "none"
        })
}

// Draws two cards from the deck and updates remaning cards and health of player one and two
drawCardBtn.addEventListener("click", () => {

    fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {

            let i = 0
            for (const kid of cardsContainer.children) {
                kid.innerHTML = `<img src=${data.cards[i].image} class="card" />`
                i++
            }

            heroText.innerHTML = winnerDecider(data.cards[0], data.cards[1])
            heroText.style.display = 'block'

            currentHealthOne.innerHTML = `
            Monster wins: ${scorePlayerOne}
            `
            currentHealthTwo.innerHTML = `
            Your wins: ${scorePlayerTwo}
            `
            healthBar.style.width = (data.remaining * 7.6)
            numberOfCards.innerHTML = data.remaining

            if (data.remaining === 0) {
                endGame()
            }

        })
})


// Decides which of the two cards has the higher value
function winnerDecider(card1, card2) {
    const scores = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]

    if (scores.indexOf(card1.value) > scores.indexOf(card2.value)) {
        scorePlayerOne++
        return `The monster wins!`
    }
    else if (scores.indexOf(card1.value) === scores.indexOf(card2.value)) {
        return `It's a draw, continue!`
    }
    else {
        scorePlayerTwo++
        return `You win this round!`
    }

}

// When cards deck is empty show end game text and remove "old game" elements
function endGame() {

    restartGameBtn.style.display = "block"
    drawCardBtn.style.display = "none"
    gameText.style.display = "none"
    currentHealthOne.style.display = "none"
    currentHealthTwo.style.display = "none"
    cardsContainer.style.display = "none"
    numberOfCards.style.display = "none"

    if (scorePlayerOne > scorePlayerTwo) {
        console.log("player 1 wom")
        heroText.textContent = `The monster has won, good luck next time...a new monster approaches!`
        heroText.style.display = 'block'
    }
    else if (scorePlayerOne < scorePlayerTwo) {
        heroText.textContent = `You have been victourious, a new monster approaches!`
        heroText.style.display = 'block'
    }
    else {
        heroText.textContent = `You are not a winner, nor a loser! A new monster approaches`
        heroText.style.display = 'block'
    }

}

// Funtion that resets the data so that the game can start over 
restartGameBtn.addEventListener('click', restartGame)
function restartGame() {

    scorePlayerOne = 0
    scorePlayerTwo = 0

    currentHealthOne.innerHTML = `
    Monster wins: 0
    `
    currentHealthTwo.innerHTML = `
    Your wins: 0
    `

    numberOfCards.innerHTML = 52
    healthBar.style.width = (52 * 7.6)

    deckOne.innerHTML = ''
    deckTwo.innerHTML = ''

    handleClick()
    drawCardBtn.style.display = "block"
    gameText.style.display = "block"
    currentHealthOne.style.display = "block"
    currentHealthTwo.style.display = "block"
    cardsContainer.style.display = "block"
    numberOfCards.style.display = "block"
    restartGameBtn.style.display = "none"
}