import fs from 'fs';

// path: /api/addPlayer
export default function addPlayer (req, res) {
    fs.readFile('./data/players.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        const players = JSON.parse(data);
        let newPlayer = req.body;
        //last player id + 1
        if (players.length > 0)
            newPlayer.id = players[players.length - 1].id + 1;
        else
            newPlayer.id = 1;
        players.push(newPlayer);
        fs.writeFile('./data/players.json', JSON.stringify(players), (err) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            res.status(200).json({ message: 'New player added successfully', player: newPlayer });
          }
        });
      }
    });
  }