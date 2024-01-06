import fs from 'fs';

// path: /api/updatePlayer
export default function updatePlayer (req, res){
  fs.readFile('./data/players.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      const players = JSON.parse(data);
      const playerIndex = players.findIndex(player => player.id === req.body.id);
      players[playerIndex] = req.body;
      fs.writeFile('./data/players.json', JSON.stringify(players), (err) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({ message: 'Player updated successfully' });
        }
      });
    }
  });
}