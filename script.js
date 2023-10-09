const agree = document.getElementById('yes');
const disagree = document.getElementById('no');
const color = document.querySelector('.color');
const text = document.querySelector('.text');

let colors = ['blue', 'yellow', 'green', 'red', 'violet', 'black', 'orange'];

function startGame() {
    color.textContent = colors[Math.floor(Math.random() * colors.length)].toUpperCase();
    color.style.color = colors[Math.floor(Math.random() * colors.length)];
    text.textContent = colors[Math.floor(Math.random() * colors.length)].toUpperCase();
    text.style.color = colors[Math.floor(Math.random() * colors.length)];
}

console.log(color.style.color);
console.log(text.textContent)

agree.addEventListener('click', () => {
    if(color.style.color.toUpperCase() === text.textContent) {
        console.log('yes');
        startGame();
    } else {
        //alert error
    }
})

disagree.addEventListener('click', () => {
    if(color.style.color.toUpperCase() !== text.textContent) {
        console.log('no');
        startGame();
    } else {
        //alert error
    }
})

startGame();
