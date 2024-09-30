// Fetch and display rhythm games
async function fetchData() {
    const gameList = document.getElementById('gameList');
    const gamesResponse = await fetch('/rhythmgames');
    const games = await gamesResponse.json();
    gameList.innerHTML = games.map(game => `<li>${game.id}. ${game.name} (${game.company})</li>`).join('');
}

fetchData();
