// public/films.js

const API = (function() {
    let films = [];

    function clearSuccessMessage() {
        const msg = document.getElementById('successMessage');
        msg.textContent = '';
        msg.classList.add('hidden');
    }

    function createFilm() {
        const input = document.getElementById('filmTitle');
        const ratingInput = document.getElementById('filmRating');
        const title = input.value.trim();
        const rating = parseInt(ratingInput.value, 10);
        clearSuccessMessage();

        if (title.length === 0) {
            showSuccess('Film title cannot be empty.', true);
            return false;
        }

        if (isNaN(rating) || rating < 1 || rating > 10) {
            showSuccess('Please provide a rating between 1 and 10.', true);
            return false;
        }

        films.push({ title: title, rating: rating });
        input.value = '';
        ratingInput.value = '10';
        showSuccess('Film added successfully!');

        if (films.length === 0) {
            document.getElementById('filmsTable').classList.add('hidden');
        }
        return false;
    }

    function getFilms() {
        const table = document.getElementById('filmsTable');
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        clearSuccessMessage();

        if (films.length === 0) {
            table.classList.add('hidden');
            return false;
        }

        films.forEach((film, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${idx + 1}</td>
                <td>${film.title}</td>
                <td><span class="badge">${film.rating}/10</span></td>
            `;
            tbody.appendChild(row);
        });

        table.classList.remove('hidden');
        return false;
    }

    function showSuccess(message, isError = false) {
        const msg = document.getElementById('successMessage');
        msg.textContent = message;
        msg.className = isError ? 'error' : 'success';
        setTimeout(clearSuccessMessage, 2000);
    }

    return {
        createFilm,
        getFilms
    };
})();
