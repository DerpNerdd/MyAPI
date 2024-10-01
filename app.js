const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));


let rhythmGames = require('./rhythmgames.json');
let songs = require('./songs.json');


const ADMIN_TOKEN = "admin123";


app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Rhythm Game API</h1><p>Use the API endpoints to view or manage rhythm games and songs.</p>');
});


app.get('/api/rhythmgames', (req, res) => {
    const { search, limit } = req.query;
    let filteredGames = [...rhythmGames];

    if (search) {
        filteredGames = filteredGames.filter(game => game.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (limit) {
        filteredGames = filteredGames.slice(0, Number(limit));
    }

    res.status(200).json(filteredGames);
});


app.get('/api/rhythmgames/:id', (req, res) => {
    const { id } = req.params;
    const game = rhythmGames.find(game => game.id === Number(id));

    if (!game) {
        return res.status(404).json({ message: "Rhythm game not found" });
    }

    res.json(game);
});


app.get('/api/songs', (req, res) => {
    const { search, limit } = req.query;
    let filteredSongs = [...songs];

    if (search) {
        filteredSongs = filteredSongs.filter(song => song.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (limit) {
        filteredSongs = filteredSongs.slice(0, Number(limit));
    }

    res.status(200).json(filteredSongs);
});


app.get('/api/songs/:id', (req, res) => {
    const { id } = req.params;
    const song = songs.find(song => song.id === Number(id));

    if (!song) {
        return res.status(404).json({ message: "Song not found" });
    }

    res.json(song);
});

app.get('/api/:id', (req, res) => {
    const { id } = req.params;    
    const game = rhythmGames.find(game => game.id === Number(id));
    const song = songs.find(song => song.id === Number(id));

    if (!game && !song) {
        return res.status(404).json({ message: "No rhythm game or song found with this ID" });
    }
    
    res.json({
        game: game || null,  
        song: song || null   
    });
});

app.get('/api/rhythmgames/add/:name/:company/:token', (req, res) => {
    const { name, company, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const newGame = { id: rhythmGames.length + 1, name, company };
    rhythmGames.push(newGame);
    fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));

    res.status(201).json(newGame);
});


app.get('/api/songs/add/:title/:game_id/:song_level/:token', (req, res) => {
    const { title, game_id, song_level, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const newSong = { id: songs.length + 1, title, game_id: parseInt(game_id), song_level: parseInt(song_level) };
    songs.push(newSong);
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));

    res.status(201).json(newSong);
});


app.get('/api/rhythmgames/:id/delete/:token', (req, res) => {
    const { id, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    rhythmGames = rhythmGames.filter(game => game.id !== Number(id));
    fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));

    res.status(204).send('Deleted successfully');
});


app.get('/api/songs/:id/delete/:token', (req, res) => {
    const { id, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    songs = songs.filter(song => song.id !== Number(id));
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));

    res.status(204).send('Deleted successfully');
});


app.get('/api/rhythmgames/:id/update/:name/:company/:token', (req, res) => {
    const { id, name, company, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const gameIndex = rhythmGames.findIndex(game => game.id === Number(id));

    if (gameIndex === -1) {
        return res.status(404).json({ message: 'Rhythm game not found' });
    }

    rhythmGames[gameIndex] = { id: Number(id), name, company };
    fs.writeFileSync('./rhythmgames.json', JSON.stringify(rhythmGames, null, 4));

    res.json(rhythmGames[gameIndex]);
});


app.get('/api/songs/:id/update/:title/:game_id/:song_level/:token', (req, res) => {
    const { id, title, game_id, song_level, token } = req.params;

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const songIndex = songs.findIndex(song => song.id === Number(id));

    if (songIndex === -1) {
        return res.status(404).json({ message: 'Song not found' });
    }

    songs[songIndex] = { id: Number(id), title, game_id: parseInt(game_id), song_level: parseInt(song_level) };
    fs.writeFileSync('./songs.json', JSON.stringify(songs, null, 4));

    res.json(songs[songIndex]);
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
