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
                console.error("There was an errer:" + error);
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
                queenImgLinks[q.id] = q.image_url;
            }
        })
}


async function start(){
    document.getElementById("startButton").disabled = true;
    document.getElementById("restartButton").disabled = true;
    score = 0;
    currentRound = 0
    gameData = [];
    await getLipsyncData();
    await getEpisodeInformation(); 
    preloadImages();
    document.getElementById("startButton").disabled = false;
    document.getElementById("restartButton").disabled = false;
    displayRound();
    document.querySelector("#startMenu").style.display = "none";
    document.querySelector("#game").style.display = "block";
    document.querySelector("#endScreen").style.display = "none";
}

// async function getEpisodeInformation(epID){
//     var episode_url = `https://www.nokeynoshade.party/api/episodes/${epID}`;
//     await fetch(episode_url)
//         .then(response => {
//             if(!response.ok){
//                 throw new error("Network response not okay");
//             }
//             return response.json();
//         })
//         .then(episode => {
//             return episode;
//         })
//         .catch(error => {
//             console.error("Getting Episode Error:" + error);
//         })
// }

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

// async function getSeasonInformation(){
//     await fetch("http://www.nokeynoshade.party/api/seasons")
//         .then(response => {
//             if(!response.ok){
//                 throw new error("Network response not okay");
//             }
//             return response.json();
//         })
//         .then(seasons => {
//             var seasonMap = {};
//             for (var i = 0; i < seasons.length; i++){
//                 seasonMap[seasons[i].id] = seasons[i].seasonNumber;
//             }
            
//             for (var i = 0; i < gameData.length; i++){
//                 gameData[i]["seasonNumber"] = seasonMap[gameData[i].seasonId];
//             }
//             console.log(seasonMap);
//         })
//         .catch(error => {
//             console.error("Error getting season data: " + error);
//         })
// }

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
    document.querySelector(".episodeTitle").innerHTML = gameData[currentRound].episodeName;
    document.querySelector("#seasonNumber").innerHTML = gameData[currentRound].seasonNumber;
    document.querySelector("#episodeNumber").innerHTML = gameData[currentRound].episodeNumber;
}

function displayEnd(){
    document.querySelector("#startMenu").style.display = "none";
    document.querySelector("#game").style.display = "none";
    document.querySelector("#endScreen").style.display = "block";
    document.querySelector("#scoreDisplay").innerHTML = "Your score is " + score;
}


