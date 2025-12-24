const { downloadTeamLogos } = require('../services/fetchTeamsLogos');

async function fetchLogosEndpoint(req, res) {
    await downloadTeamLogos();
    res.send('Logoak deskargatuta');
}
