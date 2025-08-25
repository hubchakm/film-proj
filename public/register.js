const Auth = (() => {
    const API_BASE = '/api/v1';

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

    async function handleResponse(res) {
        const contentType = res.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await res.json() : await res.text();
        if (!res.ok) {
            throw new Error(data.message || data || 'Request failed');
        }
        return data;
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
            .then(handleResponse)
            .then(() => {
                showMessage('User registered successfully');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 500);
            })
            .catch(err => showMessage(err.message || err, true));
        return false;
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('token')) {
            window.location.href = 'index.html';
        }
    });

    return { register };
})();
