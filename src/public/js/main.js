import { folder, leftArrow } from "./fragments.js";
import { fetchJSON, fetchSolution, fetchTeams, fetchLeagues } from "./loaders.js";
import { setupRows } from "./rows.js";
import { autocomplete } from "./autocomplete.js";



function differenceInDays(date1) {
    // YOUR CODE HERE

    // Gaurko data hartu
    const today = new Date();
    // Orduak kendu, egunetan soilik konparatzeko
    today.setHours(0, 0, 0, 0);
    date1.setHours(0, 0, 0, 0);
    // Milisegundoen arteko diferentzia kalkulatu
    const diffInMs = today.getTime() - date1.getTime();
    // Egunetara bihurtu (1 egun = 86.400.000 ms)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    // Emaitza bueltatu (zenbakia positiboa edo negatiboa izan daiteke)
    return diffInDays;
}

let difference_In_Days = differenceInDays(new Date("01-10-2025"));

window.onload = function () {
    document.getElementById("gamenumber").innerText = difference_In_Days.toString();
    document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

//Jokoaren egoera gordetzen duen objetu nagusia
let game = {
    guesses: [],
    solution: {},
    players: [],
    leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {

    // YOUR CODE HERE

    // Calculate the index in the solution array
    const index = (difference_In_Days - 1) % solutionArray.length;

    // jokalariaren id lortu
    const playerId = solutionArray[index];

    // Find the corresponding player object in the players array
    const player = players.find(p => p.id.toString() === playerId);

    // Show the player object for debugging
    console.log("Selected Player:", player);

    // Return the player object
    return player;
}

// Informazioa backend-etik lortu
Promise.all([
    fetchJSON('fullplayers25'),        // jokalari guztiak backend-etik lortu
    fetchSolution(difference_In_Days),  // eguneko jokalaria backend-etik lortu
    fetchTeams(),
    fetchLeagues()
]).then(
    (values) => {

        const [playersResponse, solutionResponse, teamsResponse, leaguesResponse] = values;

        // playersResponse --> { success, data, message }
        game.players = playersResponse.data; // jokalariak

        // solutionResponse --> { success, data, message }
        game.solution = solutionResponse.data; // eguneko jokalaria

        game.teams = teamsResponse.data; // taldeak

        game.leagues = leaguesResponse.data; // ligak

        // irudia eguneratu
        document.getElementById("mistery").src = game.solution.imageUrl; //backend-etik hartu jokalariaren irudia

        const myInput = document.getElementById("myInput");
        let addRow = setupRows(game);
        autocomplete(myInput, game);

    }
);

