/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const words = [
  'megaton',
  'fallout',
  'brotherhood',
  'legion',
  'apocalypse',
  'nuclear',
  'vaults',
  'vegas',
  'house',
  'lucky'
]

function removeWord(wordList, wordToRemove) {
    return wordList.filter(word => word !== wordToRemove)
}

function getWordPosition (wordList) {
  return Math.floor(Math.random() * wordList.length)
}

function getRandomWord (wordList, wordPosition) {
  return wordList.map(word => shuffle(word))[wordPosition]
}

function isValidGuess (guess, wordList, wordPosition) {
  return (guess.toLowerCase().trim() === wordList[wordPosition])
}


const app = Vue.createApp({
  data: function () {
    return {
      title: 'Welcome to Fallout Scramble',
      words: words.map(word => shuffle(word)),
      maxGuesses: 3,
      maxPoints: 10,
      maxStrikes: 3,
      game: {
        active: false,
        randomWord: '',
        guesses: 0,
        passes: 0,
        points: 0,
        strikes: 0,
        guess: '',
        message: '',
        wordList: [],
        passesRemaining: 3,
        wordPosition: null
      } 
    }
  },
  created: function () {
    const game = JSON.parse(localStorage.getItem('scramble'))
    if (game) {
      this.game = game
    }
  },
  methods: {
    playGame: function () {
      this.game.active = true
      this.game.wordList = words
      this.game.message = 'Unscramble the word'
      this.game.guesses = 0
      this.game.passes = 0
      this.game.passesRemaining = 3
      this.game.wordPosition = getWordPosition(this.game.wordList)
      this.game.randomWord = getRandomWord(this.game.wordList, this.game.wordPosition)
    },
    verifyGuess: function () {
      const { guess, wordList, wordPosition } = this.game
      // Guessed Right
      if (isValidGuess(guess, wordList, wordPosition)) {
        this.game.message = 'You guessed the word! Next word.'
        this.game.points++
        this.game.wordList = removeWord(this.game.wordList, this.game.guess)
        this.game.wordPosition = getWordPosition(this.game.wordList)
        this.game.randomWord = getRandomWord(this.game.wordList, this.game.wordPosition)
        this.game.removeGuessedWord = removeWord(this.game.wordList, this.game.wordToRemove)
          if (this.game.points === 10) {
            this.game.message = 'You guessed all the words! The game will now restart.'
            this.resetGame()
          }
      } 
      // Guessed Wrong
      else {
        this.game.guesses++
        this.game.strikes++
        if (this.game.guesses < this.maxGuesses) {
          if (this.game.guess !== this.game.randomWord) {
            this.game.message = 'Your guess was incorrect. Try again.'
          } 
        } else  {
            this.game.strikes = 3
            this.game.message = 'Game over. Please try again.'
            this.resetGame()
          } 
      }

      // Clear guess
      this.game.guess = ''
      },
      allPointsEarned: function () {
        if (this.game.points === 10) {
          this.game.message = 'You guessed all the words! The game will now restart.'
          this.resetGame()
        }
      },

      pass: function () {
        if (this.game.passes < 3) {
          this.game.message = 'You passed. Guess the next word.'
          this.game.passesRemaining--
          this.game.passes++
          this.game.wordPosition = getWordPosition(this.game.wordList)
          this.game.randomWord = getRandomWord(this.game.wordList, this.game.wordPosition)
         }
          else {
            this.game.passesRemaining = 0
            this.game.passes = 3
        }
      },
      resetGame: function () {
          const that = this
          setTimeout(function () {
            that.game.message = ''
            that.game.strikes = 0
            that.game.points = 0
            that.game.guess = ''
            that.game.active = false
          }, 2000)
        }         
        

      
    },
    watch: {
      game: {
        deep: true,
        handler: function (game) {
          localStorage.setItem('scramble', JSON.stringify(game))
        }
      }
    }


    
  })

const vm = app.mount('#app')