const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Load rhythm games and songs from JSON files
let rhythmGames = require('./rhythmgames.json');
let songs = require('./songs.json');

// Admin token for authentication (basic example)
const ADMIN_TOKEN = "admin123"; // In a real-world scenario, use more secure methods

// GET all rhythm games
app.get('/rhythmgames', (req, res) => {
    res.json(rhythmGames);
});

// GET all songs
app.get('/songs', (req, res) => {
    res.json(songs);
});

// POST a new rhythm game (public)
app.post('/rhythmgames', (req, res) => {
    const { name, company } = req.body;
    const newGame = {
        id: rhythmGames.length + 1,
        name,
        company
    };
    rhythmGames.push(newGame);
    fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));
    res.status(201).json(newGame);
});

// POST a new song (public)
app.post('/songs', (req, res) => {
    const { title, game_id, song_level } = req.body;
    const newSong = {
        id: songs.length + 1,
        title,
        game_id: parseInt(game_id),
        song_level: parseInt(song_level)
    };
    songs.push(newSong);
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));
    res.status(201).json(newSong);
});

// PUT to update a rhythm game (Admin)
app.put('/rhythmgames/:id', (req, res) => {
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) return res.status(403).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    const { name, company } = req.body;
    const gameIndex = rhythmGames.findIndex(game => game.id === id);

    if (gameIndex !== -1) {
        rhythmGames[gameIndex] = { id, name, company };
        fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));
        res.json(rhythmGames[gameIndex]);
    } else {
        res.status(404).json({ message: "Game not found" });
    }
});

// PUT to update a song (Admin)
app.put('/songs/:id', (req, res) => {
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) return res.status(403).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    const { title, game_id, song_level } = req.body;
    const songIndex = songs.findIndex(song => song.id === id);

    if (songIndex !== -1) {
        songs[songIndex] = { id, title, game_id: parseInt(game_id), song_level: parseInt(song_level) };
        fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));
        res.json(songs[songIndex]);
    } else {
        res.status(404).json({ message: "Song not found" });
    }
});

// DELETE a rhythm game (Admin)
app.delete('/rhythmgames/:id', (req, res) => {
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) return res.status(403).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    rhythmGames = rhythmGames.filter(game => game.id !== id);
    fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));
    res.status(204).end();
});

// DELETE a song (Admin)
app.delete('/songs/:id', (req, res) => {
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) return res.status(403).json({ message: "Unauthorized" });

    const id = parseInt(req.params.id);
    songs = songs.filter(song => song.id !== id);
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));
    res.status(204).end();
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
