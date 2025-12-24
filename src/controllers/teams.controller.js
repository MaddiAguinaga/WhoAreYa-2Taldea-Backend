const { downloadTeamLogos } = require('../../scripts/fetchTeamsLogos.js');

async function fetchLogosEndpoint(req, res) {
    await downloadTeamLogos();
    res.send('Logoak deskargatuta');
}
