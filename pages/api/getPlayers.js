import fs from 'fs';

// path: /api/getPlayers

export default function getPlayers (req, res) {
    fs.readFile('./data/players.json', 'utf8', (err, data) => {
        if (err) {
        res.status(500).json({ error: err });
        } else {
        res.status(200).json(JSON.parse(data));
        }
    });
}
