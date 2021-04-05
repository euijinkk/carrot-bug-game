'use strict'

const background = document.querySelector('#whole');

const carrotContainer = document.querySelector('.carrotContainer')
const bugContainer = document.querySelector('.bugContainer')
        
const topC = background.offsetTop;
const leftC = background.offsetLeft;

const bottomC = background.getBoundingClientRect().bottom;
const rightC = background.getBoundingClientRect().right;

const playBtn = document.querySelector('.playBtn');
let timer = document.querySelector('.timer');
let leftCarrotNum = document.querySelector('.leftCarrotNum');

// 가로로는 leftC와 rightC 사이에 존재
// 세로로는 topC와 bottomC간의 6:4 내분점과, bottomC 사이에 존재
const minHeight = topC+(bottomC-topC)*0.55
const maxHeight = bottomC;

const minWidth = leftC;
const maxWidth = rightC;

let carrotNum = 10;
let bugNum = 7;
// console.log(`minWidth : ${minWidth}`)
// console.log(`maxWidth : ${maxWidth}`)

const gameover = document.createElement('div');
gameover.setAttribute('class','gameover');
const redoBtn = document.createElement('button');
redoBtn.setAttribute('class', 'redoBtn');
const redoIcon = document.createElement('i');
redoIcon.setAttribute('class', 'fas fa-redo');
const paragraph = document.createElement('p');
paragraph.setAttribute('class', 'paragraph');

gameover.appendChild(redoBtn);
gameover.appendChild(paragraph);
redoBtn.appendChild(redoIcon);

let alertFile = new Audio('sound/alert.wav');
let bgFile = new Audio('sound/bg.mp3');
let bugFile = new Audio('sound/bug_pull.mp3');
let carrotFile = new Audio('sound/carrot_pull.mp3');
let gameWinFile = new Audio('sound/game_win.mp3');




playBtn.addEventListener('click', () => {
    playGame()
})
// space 를 누르면 게임이 시작, 중지, 재시작, redo 되도록 한다.
document.addEventListener('keydown', function (e) {
    if (e.keyCode === 32) {
        // console.log(background.children[5]);
        if(background.children[5]) {
            carrotContainer.innerHTML = "";
            bugContainer.innerHTML = "";
            
            background.removeChild(gameover);
            
            playBtn.classList.add("first");
            timer.innerHTML = "10:00"
            bgFile.currentTime =0;
            playGame();
        } else{
            playGame()
        }
        
    }
  });

redoBtn.addEventListener('click', () =>{
    carrotContainer.innerHTML = "";
    bugContainer.innerHTML = "";
    
    background.removeChild(gameover);
    
    playBtn.classList.add("first");
    timer.innerHTML = "10:00"
    bgFile.currentTime =0;
    playGame();
    
})

function timerFunction(){
    var countDown;
    return {
        startTimer : function (){
            var time = parseInt(timer.innerHTML.split(":")[0])*100+parseInt(timer.innerHTML.split(":")[1]);
            var sec ="";
            var milliSec ="";
            
            // 클로저 ㅠㅠ. 
            return countDown = setInterval(function() {
                sec = Math.floor(time/100);
                milliSec = time-100*sec;
                timer.innerText = `${sec}:${addZero(milliSec)}`;
                time--;
                if(time< 0 ) {
                    message("YOU LOSE")
                }
            },10)
        },
        // 클로저 활용! 캡슐화의 데이터은닉
        stopTimer : function (){
            clearInterval(countDown);
            console.log(countDown);
        }
    }
}

let timerFunc = timerFunction();


function addZero(num) {
    return (num < 10 ? '0'+num : ''+num)
    }
    
function playGame() {
    alertFile.play();
    if(playBtn.classList.contains("first")){
        // 첫시작
        makeThing("carrot",carrotNum);
        makeThing("bug",bugNum);
        
        playBtn.childNodes[1].className = playBtn.childNodes[1].className.replace("play","stop")
        playBtn.classList.remove("first");
        carrotContainer.addEventListener('click', (e) => {onCarrotClick(e.target);})
        bugContainer.addEventListener('click', () => {
            bugFile.play();
            message("YOU LOSE")
        }
            );
        timerFunc.startTimer();
        bgFile.play();
    } else if (playBtn.childNodes[1].classList.contains("fa-play")) {
        // 재시작
        bgFile.play();
        playBtn.childNodes[1].className = playBtn.childNodes[1].className.replace("play","stop")
        carrotContainer.addEventListener('click', (e) => {onCarrotClick(e.target);})
        timerFunc.startTimer();
    } else if (playBtn.childNodes[1].classList.contains("fa-stop")){
        // 중지
        bgFile.pause();
        playBtn.childNodes[1].className = playBtn.childNodes[1].className.replace("stop","play")
        timerFunc.stopTimer();
    }
    leftCarrotNum.innerHTML = carrotContainer.childNodes.length;
}

function onCarrotClick(target){
    const toBeDeleted = document.querySelector(`.carrot[data-id="${target.dataset.id}"]`);
    toBeDeleted.remove();
    leftCarrotNum.innerHTML = carrotContainer.childNodes.length;
    carrotFile.play();
    if(leftCarrotNum.innerHTML === "0") {
        message("YOU WIN")
    }
}

function message(message) {
    paragraph.innerHTML = message;
    background.appendChild(gameover);
    timerFunc.stopTimer();
    bgFile.pause();
    if (message==="YOU WIN") {
        gameWinFile.play();
    }
    // why is it not working?
    carrotContainer.removeEventListener('click', (e) => {onCarrotClick(e.target);});
    bugContainer.removeEventListener('click', () => message("YOU LOSE"));
}



function makeThing(thing,num) {
    for(let i=0; i<num; i++) {
        const carrotORbug = document.createElement('img');
        carrotORbug.src = `img/${thing}.png`;

        carrotORbug.setAttribute('class',`${thing} carrotORbug`);
        carrotORbug.setAttribute('data-id',`${i}th`)
        const container = document.querySelector(`.${thing}Container`)
        container.appendChild(carrotORbug);

        let carrotORbugSize = window.getComputedStyle(carrotORbug).width;
        carrotORbugSize = parseInt(carrotORbugSize.replace("/a-z/g",""))

        carrotORbug.style.top = `${getRandomArbitrary(minHeight,maxHeight)-carrotORbugSize}px`;
        carrotORbug.style.left = `${getRandomArbitrary(minWidth,maxWidth-carrotORbugSize)}px`;
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }



// 부족한 점
// 1. 이미지가 정사각형으로 인식되어, 이기는게 불가능할 수 있다.
// 2. 화면이 resize되면, background image 만 움직이고 당근/벌레는 따라오지 않는 문제.
// 3. 멈추었을 때, 당근/벌레가 여전히 클릭되는 문제 - removeEventListener is now working.
// 4. 재생버튼, hover -> 1.1배 ㅇ
// 5. sound  ㅇ
// 6. 스페이스바를 누르면 게임이 시작되도록.