const agree = document.getElementById('yes');
const disagree = document.getElementById('no');
const color = document.querySelector('.color');
const text = document.querySelector('.text');
const scoreInfo = document.querySelector('.score');
const correct = document.querySelector('.correct');
const uncorrect = document.querySelector('.uncorrect');
const startButton = document.querySelector('.start-button');
const table = document.querySelector('.table table');
const tbody = table.querySelector('tbody');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const results = document.querySelector('.results');

let colors = ['blue', 'yellow', 'green', 'red', 'violet', 'black', 'orange'];
let timer;
let score = 0;
let remainingTime = 60;
let players = [];
let lastSavedName;
let gameActive = false;

function startGame() {
    gameActive = true;
    startTimer();
    startButtonDisabled();
    agree.addEventListener('click', agreeClickHandler);
    disagree.addEventListener('click', disagreeClickHandler);
}

function randomizeColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function changeCards() {
    color.textContent = randomizeColor().toUpperCase();
    color.style.color = randomizeColor()
    text.textContent = randomizeColor().toUpperCase();
    text.style.color = randomizeColor()
}

function showCorrectIcon() {
  correct.style.display = 'block';
        setTimeout(() => {
            correct.style.display = 'none';
        }, 300)
};

function showUncorrectIcon() {
  uncorrect.style.display = 'block';
  setTimeout(() => {
      uncorrect.style.display = 'none';
  }, 300);
};

function showScoreInfo() {
  scoreInfo.textContent = `Score: ${score}`;
        changeCards();
};

function agreeClickHandler() {
    if(color.style.color.toUpperCase() === text.textContent) {
        // correct.style.display = 'block';
        // setTimeout(() => {
        //     correct.style.display = 'none';
        // }, 300)
        showCorrectIcon();
        score = score + 1;
        showScoreInfo();
    } else {
        showUncorrectIcon();
        changeCards();
    }
}

function disagreeClickHandler() {
    if(color.style.color.toUpperCase() !== text.textContent) {
        score = score + 1;
        showCorrectIcon();
        showScoreInfo();
    } else {
        showUncorrectIcon();
        changeCards();
    }
}

function startButtonDisabled() {
    startButton.disabled = true;
    startButton.style.backgroundColor = '#6e6e6e';
    startButton.style.boxShadow = 'inset -5px -5px 2px rgb(185, 184, 184)';
    startButton.style.color = 'rgb(204, 203, 203)';
}

function startButtonEnabled() {
    startButton.disabled = false;
    startButton.style.backgroundColor = '#fff';
    startButton.style.boxShadow = 'inset -5px -5px 2px rgba(102, 102, 102, 0.2)';
    startButton.style.color = 'rgb(90, 90, 90)';

}

function startTimer() {
    const timeDisplay = document.querySelector('.timer');

    timer = setInterval(() => {
        remainingTime--;
        const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
        const seconds = (remainingTime % 60).toString().padStart(2, '0');
    
        timeDisplay.textContent = `Remaining time: ${minutes}:${seconds}`;
    
        if (remainingTime <= 0) {
          clearInterval(timer);
          timeDisplay.textContent = 'Time is over!';
          stopGame();
        }
      }, 1000);
}

function updateLeaders() {
    Swal.close();
    tbody.innerHTML = '';
    modal.style.display = 'flex';
  const playerScoreData = JSON.parse(localStorage.getItem('players'));
  if(playerScoreData) {
    const sortedPlayers = Object.entries(playerScoreData)
    .filter(([key, value]) => value.score)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 5);
  
    sortedPlayers.forEach(([playerName, player]) => {
      const row = tbody.insertRow();
      const nameCell = row.insertCell(0);
      const scoreCell = row.insertCell(1);
      nameCell.textContent = playerName;
      scoreCell.textContent = player.score;
    })
  }
}

function closeModal() {
    modal.style.display = 'none';
}

modal.addEventListener('click', () => {
    closeModal();
  });

close.addEventListener('click', () => {
    closeModal();
  })


function stopGame() {
    gameActive = false;
    remainingTime = 60;
    startButtonEnabled();
    agree.disabled = true;
    disagree.disabled = true;

    const playerData = JSON.parse(localStorage.getItem('players'));

    const currentPlayerName = playerData.playerName;
    if(playerData[currentPlayerName]) {
      if(playerData[currentPlayerName].score < score) {
        playerData[currentPlayerName].score = score;
      }
    } else {
      playerData[currentPlayerName] = {
        score: score,
      };
    }
      localStorage.setItem('players', JSON.stringify(playerData));

    Swal.fire ({
        icon: 'info',
        iconColor: '#ECA1B4',
        confirmButtonColor: '#7CB9CD',
        title: 'Time is over!',
        text: `Your score:  ${score}.`,
        allowOutsideClick: false,
        footer: '<a href="#" onclick = "updateLeaders()">See leaders :)</a>',
      })
      document.addEventListener('click', (event) => {
          if (!gameActive) return;
      });
}

//получение имени последнего игравшего
function getLastSavedName() {
    const playerData = JSON.parse(localStorage.getItem('players'));
    if (playerData && playerData.playerName) {
       lastSavedName = playerData.playerName;
    } else lastSavedName = '';
  }


startButton.addEventListener('click', () => {
    getLastSavedName();
    scoreInfo.textContent = `Score: 0`;
    score = 0;
    agree.disabled = false;
    disagree.disabled = false;

    //запрос имени игрока
    Swal.fire({
        title: 'Enter your name',
        showCancelButton: true,
        confirmButtonText: 'Play',
        confirmButtonColor: '#7CB9CD',
        cancelButtonColor: '#ECA1B4',
        input: 'text',
        inputValue: `${lastSavedName}`,
        inputValidator: (value) => {
          return !value && 'You need to enter your name!'
        },
        footer: '<a href="#" onclick = "howToPlayEng()">Read How to play the game :)</a>',
      }).then((result) => {
        if (result.isConfirmed) {
          playerName = result.value;
          const playerData = JSON.parse(localStorage.getItem('players')) || {};
          playerData.playerName = playerName.charAt(0).toUpperCase() + playerName.slice(1).toLowerCase();
          localStorage.setItem('players', JSON.stringify(playerData));
        startGame();
         } else {
          startButtonEnabled();
        }
      })
})

results.addEventListener('click', () => {
    if(!gameActive) {
        updateLeaders();
    }
})

//правило игры
const howToPlayEng = () => {
    Swal.fire({
      icon: 'question',
      iconColor: '#ECA1B4',
      confirmButtonColor: '#7CB9CD',
      title: 'How to play',
      html: `This game is designed to enhance your attention.</br>
      </br>
      Within a set time, you will be presented with two cards.</br>
      Your task is to compare if color of the left card match the name of the rigth one.</br>
      </br>
      Each correct comparison earns you 1 point.</br>
      </br>
      Play and improve your visual attention.</br>
      </br>`,
    })
  }

changeCards();
