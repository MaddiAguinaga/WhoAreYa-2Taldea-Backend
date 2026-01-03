// loaders.js - BACKEND BERTSIOA
export { fetchJSON, fetchPlayer, fetchSolution, fetchTeams, fetchLeagues };
const API_URL = 'http://localhost:3000/api';

async function fetchJSON(what) {
    // Orain backend-era deitzen du, fitxategi estatikoen ordez
    let endpoint;

    if (what === 'fullplayers25') {
        endpoint = `${API_URL}/players`;
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function fetchPlayer(playerId) {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    return await response.json();
}

async function fetchSolution(gameNumber) {
    const response = await fetch(`${API_URL}/players/solution/${gameNumber}`);
    return await response.json();
}

async function fetchTeams() {
    const response = await fetch(`${API_URL}/teams`);
    return await response.json();
}

async function fetchLeagues() {
    const response = await fetch(`${API_URL}/leagues`);
    return await response.json();
}
