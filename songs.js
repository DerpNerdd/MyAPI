async function fetchData() {
    const songList = document.getElementById('songList');
    const songsResponse = await fetch('/songs');
    const songs = await songsResponse.json();
    songList.innerHTML = songs.map(song => `<li>${song.id}. ${song.title} (Game ID: ${song.game_id}, Level: ${song.song_level})</li>`).join('');
}

fetchData();