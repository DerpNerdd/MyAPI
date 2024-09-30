// Fetch data to display and handle Admin actions

// Handle adding new rhythm game
document.getElementById('addGameForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;

    try {
        const response = await fetch('/rhythmgames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, company })
        });
        const result = await response.json();
        alert(`Game added successfully: ${result.name}`);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add game.');
    }
});

// Handle adding new song
document.getElementById('addSongForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const game_id = document.getElementById('game_id').value;
    const song_level = document.getElementById('song_level').value;

    try {
        const response = await fetch('/songs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, game_id, song_level })
        });
        const result = await response.json();
        alert(`Song added successfully: ${result.title}`);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add song.');
    }
});

// Handle editing rhythm games and songs
document.getElementById('editForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const editType = document.getElementById('editType').value;
    const editId = document.getElementById('editId').value;

    let url = '', bodyData = {};
    if (editType === 'game') {
        const newGameName = prompt('Enter new game name:');
        const newCompany = prompt('Enter new company:');
        url = `/rhythmgames/${editId}`;
        bodyData = { name: newGameName, company: newCompany };
    } else if (editType === 'song') {
        const newSongTitle = prompt('Enter new song title:');
        const newGameId = prompt('Enter new game ID:');
        const newSongLevel = prompt('Enter new song level:');
        url = `/songs/${editId}`;
        bodyData = { title: newSongTitle, game_id: newGameId, song_level: newSongLevel };
    }

    try {
        const adminToken = prompt('Enter admin token:');
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': adminToken
            },
            body: JSON.stringify(bodyData)
        });
        const result = await response.json();
        alert(`${editType === 'game' ? 'Game' : 'Song'} updated successfully.`);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update entry.');
    }
});

// Handle deleting rhythm games or songs
document.getElementById('deleteForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const deleteType = document.getElementById('deleteType').value;
    const deleteId = document.getElementById('deleteId').value;

    let url = '';
    if (deleteType === 'game') {
        url = `/rhythmgames/${deleteId}`;
    } else if (deleteType === 'song') {
        url = `/songs/${deleteId}`;
    }

    try {
        const adminToken = prompt('Enter admin token:');
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'x-admin-token': adminToken
            }
        });
        if (response.status === 204) {
            alert(`${deleteType === 'game' ? 'Game' : 'Song'} deleted successfully.`);
        } else {
            alert('Failed to delete entry.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete entry.');
    }
});
