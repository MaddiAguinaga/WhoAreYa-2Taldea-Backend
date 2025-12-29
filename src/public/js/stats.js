let initState = function(what, solutionId) {

    // YOUR CODE HERE

    // localstorage-etik lortu objektua
    let obj = localStorage.getItem(what);
    let state;

    if (obj) { // objektua existitzen bada, parseatu
        state = JSON.parse(obj);
    } else { // objektua ez bada existitzen, sortu objektu berria guesses hutsik jarriz
        state = {
            solution: solutionId,
            guesses: []
        };

        // localStorage-en gorde
        localStorage.setItem(what, JSON.stringify(state));
    }

    // Guess berriak gorde eta localStorage-n eguneratzeko funtzioa
    let addGuess = function (guess) {
        localStorage.setItem(what, JSON.stringify(state));  // localStorage eguneratu
    };

    // Bi baloreko array-a bueltatu [state, funtzioa]
    return [state, addGuess];
}



function successRate (e){
    // YOUR CODE HERE
    const totalGames = e.totalGames;
    const gamesFailed = e.gamesFailed;

    if (totalGames == 0) return 0;

    const wins = totalGames - gamesFailed;
    return Math.round((wins / totalGames) * 100); // Emaitza borobiltzeko
}

let getStats = function(what) {
    // YOUR CODE HERE

    // Saiatu localStorage-tik irakurtzen
    let stored = localStorage.getItem(what);

    // Existitzen bada -> parse eta itzuli
    if (stored) {
        return JSON.parse(stored);
    }

    // Bestela -> sortu estatistika berriak
    let freshStats = {
        winDistribution: [0,0,0,0,0,0,0,0,0],
        gamesFailed: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalGames: 0,
        successRate: 0
    };

    // localStorage-n gorde
    localStorage.setItem(what, JSON.stringify(freshStats));

    // Itzuli sortu berria
    return freshStats;
};


function updateStats(t, success) {
    // YOUR CODE HERE


    // gameStats kargatu edo sortu
    let gameStats = JSON.parse(localStorage.getItem("gameStats")) || {
        winDistribution: [0,0,0,0,0,0,0,0,0],
        gamesFailed: 0,
        currentStreak: 0,
        bestStreak: 0,
        totalGames: 0,
        successRate: 0
    };

    // partida kopurua handitu
    gameStats.totalGames++;


    if (success) {
        // Partida irabazi dugunez
        gameStats.currentStreak++;

        // ratxa onenena eguneratu
        if (gameStats.currentStreak > gameStats.bestStreak) {
            gameStats.bestStreak = gameStats.currentStreak;
        }

        // asmatze distribuzioa
        gameStats.winDistribution[t]++;
    } else {
        // Partida galdu da, ez da 8 saiakeretan jokalaria asmatu
        gameStats.gamesFailed++;

        // Ratxa hasieratzen da
        gameStats.currentStreak = 0;
    }

    // Success rate kalkulatu
    gameStats.successRate = successRate(gameStats)

    // localStorage-en gorde
    localStorage.setItem("gameStats", JSON.stringify(gameStats));
}



let gamestats = getStats('gameStats');

export {updateStats, getStats, initState}

