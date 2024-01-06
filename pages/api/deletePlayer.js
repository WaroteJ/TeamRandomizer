import fs from 'fs';

// path: /api/deletePlayer

export default function deletePlayer (req, res) {
    fs.readFile('./data/players.json', 'utf8', (err, data) => {
        if (err) {
        res.status(500).json({ error: err });
        } else {
        const players = JSON.parse(data);
        const playerIndex = players.findIndex(player => player.id === req.body.id);
        players.splice(playerIndex, 1);
        fs.writeFile('./data/players.json', JSON.stringify(players), (err) => {
            if (err) {
            res.status(500).json({ error: err });
            } else {
            res.status(200).json({ message: 'Player deleted successfully' });
            }
        });
        }
    });
}