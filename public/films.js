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

    function createFilm() {
        const titleInput = document.getElementById('filmTitle');
        const ratingInput = document.getElementById('filmRating');
        const title = titleInput.value.trim();
        const ratingRaw = ratingInput.value.trim();
        clearMessage();

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

        fetch('/api/v1/films', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, rating })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => Promise.reject(data.message || 'Failed to add film.'));
                }
                return res.json();
            })
            .then(() => {
                titleInput.value = '';
                ratingInput.value = '';
                showMessage('Film added successfully!');
            })
            .catch(err => showMessage(err, true));

        return false;
    }

    function getFilms() {
        const table = document.getElementById('filmsTable');
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        clearMessage();

        fetch('/api/v1/films')
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    table.classList.add('hidden');
                    return;
                }
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
            .catch(() => showMessage('Failed to retrieve films.', true));

        return false;
    }

    return {
        createFilm,
        getFilms
    };
})();
