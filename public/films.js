// public/films.js

const API = (function() {
    function clearMessage() {
        const msg = document.getElementById('successMessage');
        msg.textContent = '';
        msg.classList.add('hidden');
    }

    function showMessage(message, isError = false) {
        const msg = document.getElementById('successMessage');
        msg.textContent = message;
        msg.className = isError ? 'error' : 'success';
        setTimeout(clearMessage, 2000);
    }

    const API_BASE = '/api/v1';
    const API_URL = `${API_BASE}/films`;
    let jwtToken = localStorage.getItem('token') || '';

    const logoutBtn = document.getElementById('logoutBtn');
    if (!jwtToken) {
        if (logoutBtn) logoutBtn.classList.add('hidden');
        const filmForm = document.getElementById('filmForm');
        const clearForm = document.getElementById('clearFilmsForm');
        if (filmForm) filmForm.classList.add('hidden');
        if (clearForm) clearForm.classList.add('hidden');
    }

    async function handleResponse(res) {
        const contentType = res.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await res.json() : await res.text();
        if (!res.ok) {
            throw new Error(data.message || data || 'Request failed');
        }
        return data;
    }

    function createFilm() {
        const titleInput = document.getElementById('filmTitle');
        const ratingInput = document.getElementById('filmRating');
        const title = titleInput.value.trim();
        const ratingRaw = ratingInput.value.trim();
        clearMessage();

        if (!jwtToken) {
            showMessage('Please login to add films.', true);
            return false;
        }
        if (title.length === 0) {
            showMessage('Title cannot be empty.', true);
            return false;
        }
        if (ratingRaw.length === 0) {
            showMessage('Rating cannot be empty.', true);
            return false;
        }
        const rating = parseInt(ratingRaw, 10);
        if (isNaN(rating) || rating < 1 || rating > 10) {
            showMessage('Please provide a rating between 1 and 10.', true);
            return false;
        }

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ title, rating })
        })
            .then(handleResponse)
            .then(() => {
                showMessage('Film saved successfully!');
                titleInput.value = '';
                ratingInput.value = '';
            })
            .catch(err => showMessage(err.message || err, true));

        return false;
    }

    function getFilms() {
        const table = document.getElementById('filmsTable');
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        clearMessage();

        const headers = jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {};

        fetch(API_URL, { headers })
            .then(handleResponse)
            .then(data => {
                data.forEach((film, idx) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${idx + 1}</td>
                        <td>${film.title}</td>
                        <td><span class="badge">${film.rating}/10</span>$
                            {jwtToken ? ` <button class="edit-btn" data-id="${film._id}" data-rating="${film.rating}">Edit</button>` : ''}
                        </td>
                    `;
                    tbody.appendChild(row);
                });
                if (jwtToken) {
                    tbody.querySelectorAll('.edit-btn').forEach(btn => {
                        btn.addEventListener('click', () => updateFilm(btn.dataset.id, btn.dataset.rating));
                    });
                }
                table.classList.remove('hidden');
            })
            .catch(err => {
                table.classList.add('hidden');
                showMessage(err.message || err, true);
            });

        return false;
    }

    function clearFilms() {
        const table = document.getElementById('filmsTable');
        const tbody = table.querySelector('tbody');
        clearMessage();

        fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        })
            .then(handleResponse)
            .then(() => {
                tbody.innerHTML = '';
                table.classList.add('hidden');
                showMessage('Films cleared successfully');
            })
            .catch(err => showMessage(err.message || err, true));

        return false;
    }

    function updateFilm(id, currentRating) {
        clearMessage();
        if (!jwtToken) {
            showMessage('Please login to update films.', true);
            return;
        }
        const ratingRaw = prompt('Enter new rating (1-10):', currentRating);
        if (ratingRaw === null) {
            return;
        }
        const rating = parseInt(ratingRaw, 10);
        if (isNaN(rating) || rating < 1 || rating > 10) {
            showMessage('Please provide a rating between 1 and 10.', true);
            return;
        }
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify({ rating })
        })
            .then(handleResponse)
            .then(() => {
                showMessage('Film rating updated successfully');
                getFilms();
            })
            .catch(err => showMessage(err.message || err, true));
    }

    function logout() {
        localStorage.removeItem('token');
        jwtToken = '';
        window.location.href = 'login.html';
    }

    return {
        createFilm,
        getFilms,
        clearFilms,
        logout,
        updateFilm
    };
})();

