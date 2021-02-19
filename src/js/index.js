var score = 0
var currentRound = 0
var numberOfRounds = 10
var gameData = [] 
var queenImgLinks = {}

// Preload images
function preloadImages() {
    for (round of gameData){
        for (queen of round.queens){
            var image = new Image();
            image.src = queenImgLinks[queen.id];
        }
    }
}

window.onload = () => {
    document.querySelector("#startMenu").style.display = "block";
    // should start off none
    document.querySelector("#game").style.display = "none";
    document.querySelector("#endScreen").style.display = "none";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function getData(){
    for(var i = 0; i < numberOfRounds; ){
        let id = getRandomInt(171);
        url = 'http://www.nokeynoshade.party/api/lipsyncs/' + id;
        await fetch(url)
            .then(response => {
                if(!response.ok){
                    throw new error("Network response not okay");
                }
                return response.json();
            })
            .then(lipsync => {
                gameData.push(lipsync);
                i++;
            })
            .catch(error => {
                console.error("There was an errer:" + error);
            })
    }
}

async function getQueenData(){
    // console.log(gameData);
    let url = `http://www.nokeynoshade.party/api/queens/all`
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(queens => {
            // console.log(queens);
            //queenImgLinks[queenID] = queen.image_url;
            getImageLinks(queens);
        })
}

function getImageLinks(queenData){
    for (q of queenData){
        queenImgLinks[q.id] = q.image_url;
    }
}

async function start(){
    document.getElementById("startButton").disabled = true;
    document.getElementById("restartButton").disabled = true;
    score = 0;
    currentRound = 0
    gameData = [];
    await getData();
    await getQueenData();
    preloadImages();
    document.getElementById("startButton").disabled = false;
    document.getElementById("restartButton").disabled = false;
    displayRound();
    document.querySelector("#startMenu").style.display = "none";
    document.querySelector("#game").style.display = "block";
    document.querySelector("#endScreen").style.display = "none";
}

function handleChoice(choice){
    queens = gameData[currentRound].queens;

    if(queens[choice].won){
        score++;
        // alert("Correct choice");
    }
    if(currentRound == gameData.length - 1){
        displayEnd();
    } else {
        currentRound++;
        displayRound();
    }
}

function displayRound(){
    queenArr = gameData[currentRound].queens;
    var i = 0;
    buttonHTML = queenArr.map(function(queen){
        return `<div class="queen">
        <img src='${queenImgLinks[queen.id]}' onclick="handleChoice(${i++})">
        <div id="choice${i}" >${queen.name}</div>
        </div>
        `;
    }).join('');
    document.querySelector("#choices").innerHTML = buttonHTML;
}

function displayEnd(){
    document.querySelector("#startMenu").style.display = "none";
    document.querySelector("#game").style.display = "none";
    document.querySelector("#endScreen").style.display = "block";
    document.querySelector("#scoreDisplay").innerHTML = "Your score is " + score;
}


