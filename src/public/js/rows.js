// YOUR CODE HERE :
// .... stringToHTML ....
import {stringToHTML, higher, lower,stats, toggle, headless } from './fragments.js';
import { initState, updateStats} from './stats.js';



// .... setupRows .....


const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']


let setupRows = function (game) {
    const [state, addGuess, finishGame, resetState] = initState("WAYgameState", game.solution.id);
    game.guesses = state.guesses;



    function leagueToFlag(leagueId) {
        // Mapearen bidez lortu bakoitzaren flag-a
        const map = {
            564: "es1", // España (La Liga)
            8: "en1",   // Inglaterra (Premier League)
            82: "de1",  // Alemania (Bundesliga)
            384: "it1", // Italia (Serie A)
            301: "fr1"  // Francia (Ligue 1)
        };

        // balorea bueltatu, edo undefined bada -> 'unknown'
        return map[leagueId] || "unknown";
    }


    function getAge(dateString) {
        // Emandako data (string) Date-era bihurtu
        const birthDate = new Date(dateString);

        // Uneko data lortu
        const today = new Date();

        // Adina kalkulatu
        let age = today.getFullYear() - birthDate.getFullYear();

        // Orandikan urtea ez badu bete aztertu
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!hasHadBirthdayThisYear) {
            age -= 1;
        }

        return age;
    }

    let check = function (theKey, theValue) {
        // YOUR CODE HERE
        const player = getPlayer(game.solution.id);
        let result;

        // Atributua existitzen dela ziurtatu
        if (!(theKey in player)) {
            result = 'invalid key';
        }
        // Birthdate kasu berezia tratatu
        else if (theKey === 'birthdate') {
            // Bi datak Date objektu bihurtu
            const playerDate = new Date(player.birthdate);
            const inputDate = new Date(theValue);

            // Adina kalkulatu bi datetatik
            const calcAge = date => new Date().getFullYear() - date.getFullYear();

            const playerAge = calcAge(playerDate);
            const inputAge = calcAge(inputDate);

            if (playerAge === inputAge) {
                result = 'correct';
            } else if (playerAge > inputAge) {
                result = 'higher';
            } else {
                result = 'lower';
            }
        }

        // Gainerako atributuentzat konparaketa orokorra
        else if (player[theKey] === theValue) {
            result = 'correct';
        } else {
            result = 'incorrect';
        }

        return result;
    }

    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove();
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }

    function showStats(timeout) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout)
        })
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }



    function setContent(guess) {

        const solutionAge = getAge(game.solution.birthdate);
        const guessAge = getAge(guess.birthdate);

        let ageDisplay = `${guessAge}`;

        if (guessAge < solutionAge) {
            ageDisplay = `${higher} ${guessAge}`;
        } else if (guessAge > solutionAge) {
            ageDisplay = `${lower} ${guessAge}`;
        }

        return [
            `<img src="/images/flags/${guess.nationality}.svg" alt="" style="width: 60%;">`,
            `<img src="/images/leagues/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="/images/teams/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            ageDisplay
        ];

    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`

        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    function resetInput(){
        // YOUR CODE HERE
        const input = document.getElementById("myInput");
        let guessNum = game.guesses.length + 1;
        if (guessNum > 8) guessNum = 8; // 8. saiakera ondoren 'Guess 9 of 8' ez azaltzeko
        input.value = "";
        input.placeholder = `Guess ${guessNum} of 8`;
    }

    let getPlayer = function (playerId) {
        // YOUR CODE HERE
        // game.players array-an bilatu ID hori duen jokalaria
        playerId = Number(playerId);
        const player = game.players.find(p => p.id === playerId);

        // Jokalaria aurkitzen bada itzuli, bestela null
        return player || null;
    }

    function gameEnded(lastGuess){
        // YOUR CODE HERE

        // Emaitzaren Id
        const solutionId = game.solution.id;
        // Saiakera kopurua
        const attempts = game.guesses.length;

        // Asmatu bada edo 8 saiakera egin badira -> true, bestela false
        return lastGuess == solutionId || attempts === 8;
    }

    // YOUR CODE HERE
    function success() {
        // Deitu unblur-ri "success" parametroarekin
        unblur("success");
        //Deitu showStats funtzioari
        showStats(0)
    }

    // YOUR CODE HERE
    function gameOver() {
        // Deitu unblur-ri "gameOver" parametroarekin
        unblur("gameOver");
        //Deitu showStats funtzioari
        showStats(0)
    }

    //game.guesses = []
    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)
        showContent(content, guess)

        game.guesses.push(playerId);
        addGuess(playerId);

        resetInput();

        if (gameEnded(playerId)) {
            updateStats(game.guesses.length, playerId == game.solution.id);

            finishGame();

            if (playerId == game.solution.id) {
                success();
            } else {
                gameOver();
            }


            let interval = /* YOUR CODE HERE */ setInterval(() => {

                const now = new Date();

                // Hurrengo eguneko 0:00:00
                const tomorrow = new Date();
                tomorrow.setHours(24, 0, 0, 0);  // gaurko 24:00 -> biharko 0:00

                const diff = tomorrow - now;  // diferentzia milisegundotan

                if (diff <= 0) {
                    clearInterval(interval);
                    document.getElementById("nextPlayer").innerText = "00:00:00";
                    return;
                }

                const hours   = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                // Formatua: 10:48:51
                const nextNode = document.getElementById("nextPlayer");
                if (nextNode) {
                    nextNode.innerText = `${hours}:${minutes}:${seconds} `;
                }

            }, 1000);

        }

        // Mostrar guesses previos al cargar
        if (game.guesses.length > 0) {
            game.guesses.forEach(id => {
                const g = getPlayer(id);
                if (g) showContent(setContent(g), g);
            });
        }

        // Mostrar botón para nueva partida si terminó
        if (state.finished) {
            console.log("Partida bukatua");
            // Botón de nueva partida
            if (!document.getElementById('newGameBtn')) {
                const newBtn = document.createElement("button");
                newBtn.id = 'newGameBtn';
                newBtn.textContent = "Nueva partida";
                newBtn.onclick = () => {
                    const newId = getRandomPlayerId();
                    game.solution.id = newId;
                    game.guesses = [];
                    resetState(newId);
                    document.getElementById('players').innerHTML = '';
                    resetInput();
                    newBtn.remove(); // eliminar botón al iniciar nueva partida
                };
                document.body.appendChild(newBtn);
            }

        }



    }

}
export { setupRows };
