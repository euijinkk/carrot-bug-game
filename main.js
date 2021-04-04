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



playBtn.addEventListener('click', () => {
    play()
})

redoBtn.addEventListener('click', () =>{
    // carrotContainer.childNodes.remove();
    // bugContainer.childNodes.remove();
    carrotContainer.innerHTML = "";
    bugContainer.innerHTML = "";
    
    background.removeChild(gameover);
    
    playBtn.classList.add("first");
    
    play();
    
})

// 게임 시작키 눌렀을때
// 1. 벌레, 당근 생성 ㅇ
// 2. 10초 타이머 가동 
// 3. 남은 당근 개수 출력 ㅇ
// 4. 당근이 클릭되었을 때, 당근이 사라지고, 다시 숫자를 센다. ㅇ
// 5. 벌레를 누르면 게임이 끝나고, replay 키, YOU LOSE가 뜬다 ㅇ

function startTimer(){
    
}

function stopTimer(){
    console.log(startTimer());
    
}

function addZero(num) {
    return (num < 10 ? '0'+num : ''+num)
    }
    
function play() {
    if(playBtn.classList.contains("first")){
        makeThing("carrot",carrotNum);
        makeThing("bug",bugNum);
        
        playBtn.childNodes[1].className = playBtn.childNodes[1].className.replace("play","stop")
        console.log(playBtn.classList)
        playBtn.classList.remove("first");
        console.log(playBtn.classList)
        carrotContainer.addEventListener('click', (e) => {onCarrotClick(e.target);})
        bugContainer.addEventListener('click', () => message("YOU LOSE"));

        var time = 1000;
    var sec ="";
    var milliSec ="";

    var countDown = setInterval(function() {
        sec = Math.floor(time/100);
        milliSec = time-100*sec;
        timer.innerText = `${sec}:${addZero(milliSec)}`;
        time--;
        if(time< 0 ) {
            // timer.innerHTML = "00:00"
            clearInterval(countDown);
            message("YOU LOSE")
        }
    },10)
    var a=0;
    } else if (playBtn.childNodes[1].classList.contains("fa-play")) {
        console.log("재시작합니다");
        playBtn.childNodes[1].className = playBtn.childNodes[1].className.replace("play","stop")
        carrotContainer.addEventListener('click', (e) => {onCarrotClick(e.target);})
    } else if (playBtn.childNodes[1].classList.contains("fa-stop")){
        playBtn.childNodes[1].className = playBtn.childNodes[1].className.replace("stop","play")
        console.log("중지합니다");
        clearInterval(countDown);
        console.log(countDown);
        console.log(`a: ${a}`)
        // removeEventListner가 작동하지 않는다..
        // carrotContainer.removeEventListener('click', onCarrotClick);
    }
    leftCarrotNum.innerHTML = carrotContainer.childNodes.length;
}

function onCarrotClick(target){
    const toBeDeleted = document.querySelector(`.carrot[data-id="${target.dataset.id}"]`);
    toBeDeleted.remove();
    console.log(carrotContainer.childNodes.length);
    leftCarrotNum.innerHTML = carrotContainer.childNodes.length;
    console.log(typeof leftCarrotNum.innerHTML)
    if(leftCarrotNum.innerHTML === "0") {
        message("YOU WIN")
    }
}

function message(message) {
    paragraph.innerHTML = message;
    background.appendChild(gameover);
}



function makeThing(thing,num) {
    // let id =0;
    for(let i=0; i<num; i++) {
        const carrotORbug = document.createElement('img');
        carrotORbug.src = `img/${thing}.png`;

        carrotORbug.setAttribute('class',`${thing} carrotORbug`);
        carrotORbug.setAttribute('data-id',`${i}th`)
        // console.log(carrotContainer);
        const container = document.querySelector(`.${thing}Container`)
        // console.log(`.${thing}Container`);
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