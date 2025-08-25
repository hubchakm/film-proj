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

    const API_BASE = 'http://localhost:8080/api/v1';
    const API_URL = `${API_BASE}/films`;
    let jwtToken = localStorage.getItem('token') || '';

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
            .then(res => {
                setTimeout(() => {
                    if (res.ok) {
                        showMessage('Film saved successfully!');
                    } else {
                        showMessage(`${res.status} ${res.statusText}`, true);
                    }
                }, 0);
                if (!res.ok) {
                    return res.json().then(data => Promise.reject(data.message || 'Failed to add film.'));
                }
                return res.json();
            })
            .then(() => {
                titleInput.value = '';
                ratingInput.value = '';
            })
            .catch(err => showMessage(err, true));

        return false;
    }

    function getFilms() {
        const table = document.getElementById('filmsTable');
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        clearMessage();

        fetch(API_URL)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => Promise.reject(data.message || 'Failed to retrieve films.'));
                }
                return res.json();
            })
            .then(data => {
                data.forEach((film, idx) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${idx + 1}</td>
                        <td>${film.title}</td>
                        <td><span class="badge">${film.rating}/10</span></td>
                    `;
                    tbody.appendChild(row);
                });
                table.classList.remove('hidden');
            })
            .catch(err => {
                table.classList.add('hidden');
                showMessage(err, true);
            });

        return false;
    }

    function login() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        clearMessage();
        fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => Promise.reject(data.message || 'Login failed'));
                }
                return res.json();
            })
            .then(data => {
                jwtToken = data.token;
                localStorage.setItem('token', jwtToken);
                showMessage('Logged in successfully');
            })
            .catch(err => showMessage(err, true));
        return false;
    }

    function register() {
        const name = document.getElementById('regName').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        clearMessage();
        fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username, password })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => Promise.reject(data.message || 'Registration failed'));
                }
                return res.json();
            })
            .then(() => {
                showMessage('User registered successfully');
            })
            .catch(err => showMessage(err, true));
        return false;
    }

    return {
        createFilm,
        getFilms,
        login,
        register
    };
})();

