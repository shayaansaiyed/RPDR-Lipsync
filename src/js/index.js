var score = 0
var currentRound = 0
var numberOfRounds = 10
var gameData = [] 
var queenImgLinks = {}
var seasonMap = ["None", "Season 1", "Season 2", "Season 3", "Season 4", "All Stars 1", "Season 5", "Season 6", "Season 7", "Season 8", "All Stars 2", "Season 9", "All Stars 3", "Season 10", "All Stars 4", "Season 11", "Season 12", "All Stars 5"]

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
    document.querySelector(".loader").style.display = "none";
    getImageLinks();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function getLipsyncData(){
    for(var i = 0; i < numberOfRounds; ){
        let id = getRandomInt(171);
        url = 'https://www.nokeynoshade.party/api/lipsyncs/' + id;
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
                console.error("There was an error:" + error);
            })
    }
}

async function getImageLinks(){
    // console.log(gameData);
    let url = `https://www.nokeynoshade.party/api/queens/all`
    await fetch(url)
        .then(response => {
            return response.json();
        })
        .then(queens => {
            // console.log(queens);
            //queenImgLinks[queenID] = queen.image_url;
            for (q of queens){
                if (q.id == 90){ //Katya Image
                    queenImgLinks[q.id] = "http://www.nokeynoshade.party/images/Katya.jpg";
                } else if (q.id == 110) { // Eureka Ohara image
                    queenImgLinks[q.id] = "http://www.nokeynoshade.party/images/euroka-ohara.jpg";
                } else if (q.id == 128) { // Yuhua Hamasaki
                    queenImgLinks[q.id] = "http://www.nokeynoshade.party/images/yuhau-hamasaki.jpg";
                } else if (q.id == 47) {
                    queenImgLinks[q.id] = "http://www.nokeynoshade.party/images/phi-phi-o%27hara.png";
                    console.log("PHIPHI");
                } else {
                    console.log(q.image_url);
                    queenImgLinks[q.id] = q.image_url;
                }
            }
        })
}


async function start(){
    var loaders = document.querySelectorAll(".loader")
    loaders.forEach(function(loadIcon) {
        loadIcon.style.display = "block";
        console.log(loadIcon);
    });
    document.getElementById("startButton").disabled = true;
    document.getElementById("startButton").style.display = "none";
    document.getElementById("restartButton").disabled = true;
    document.getElementById("restartButton").style.display = "none";
    score = 0;
    currentRound = 0
    gameData = [];
    await getLipsyncData();
    await getEpisodeInformation(); 
    await preloadImages();
    loaders.forEach(function(loadIcon) {
        loadIcon.style.display = "none";
        console.log(loadIcon);
    });
    document.getElementById("startButton").disabled = false;
    document.getElementById("restartButton").disabled = false;
    document.getElementById("restartButton").style.display = "inline-block";
    document.getElementById("startButton").style.display = "inline-block";
    displayRound();
    document.querySelector("#startMenu").style.display = "none";
    document.querySelector("#game").style.display = "block";
    document.querySelector("#endScreen").style.display = "none";
}

async function getEpisodeInformation(){
    for(let i = 0; i < gameData.length; i++){
        var episode_url = `https://www.nokeynoshade.party/api/episodes/${gameData[i].episodeId}`;
        await fetch(episode_url)
            .then(response => {
                if(!response.ok){
                    throw new error("Network response not okay");
                }
                return response.json();
            })
            .then(episode => {
                gameData[i]["episodeName"] = episode.title;
                gameData[i]["seasonId"] = episode.seasonId;
                gameData[i]["episodeNumber"] = episode.episodeInSeason;
                gameData[i]["seasonNumber"] = seasonMap[episode.seasonId];
            })
            .catch(error => {
                console.error("Error getting episode data: " + error);
            })
    }
}

async function handleChoice(choice){
    queens = gameData[currentRound].queens;
    choiceImg = document.querySelector(`#choice${choice}`);
    

    if(queens[choice].won){
        score++;
        // alert("Correct choice");
        // animation for correct/incorrect choice
        choiceImg.classList.add("green-border");
    } else {
        choiceImg.classList.add("shake");
        choiceImg.classList.add("red-border");
        // document.querySelector("#neon-light").className = "red-neon-light";
    }

    await new Promise(r => setTimeout(r, 1000));
    if(currentRound == gameData.length - 1){
        displayEnd();
    } else {
        currentRound++;
        displayRound();
    }
}

function displayRound(){
    console.log(gameData);
    queenArr = gameData[currentRound].queens;
    var i = 0;
    buttonHTML = queenArr.map(function(queen){
        if(queen.id >= 81 && queen.id <= 106){
            // special img format for queens from season 7 and 8
            return `<div class="queen">
            <img src="${queenImgLinks[queen.id]}" id="choice${i}" onclick="handleChoice(${i++})" style="height:400px; width:300px;">
            <div class="queen-name">${queen.name}</div>
            </div>
            `;
        } else {
        return `<div class="queen">
        <img src='${queenImgLinks[queen.id]}' id="choice${i}" onclick="handleChoice(${i++})">
        <div class="queen-name">${queen.name}</div>
        </div>
        `;
        }
    }).join('');
    document.querySelector("#choices").innerHTML = buttonHTML;
    document.querySelector(".episodeTitle").innerHTML = gameData[currentRound].episodeName;
    document.querySelector("#seasonNumber").innerHTML = gameData[currentRound].seasonNumber;
    document.querySelector("#episodeNumber").innerHTML = gameData[currentRound].episodeNumber;
}

function displayEnd(){
    document.querySelector("#startMenu").style.display = "none";
    document.querySelector("#game").style.display = "none";
    document.querySelector("#endScreen").style.display = "block";
    document.querySelector("#scoreDisplay").innerHTML = "You got " + score + " out of 10!";
}


