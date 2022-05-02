const miFormulario = document.querySelector('form');

const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:3000/api/auth/' : 'heroku';

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(resp => resp.json())
        .then(({ msg, errors, token }) => {
            if (msg) {
                return console.error(msg);
            }

            if (errors) {
                return console.error(errors[0].msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })

});

function handleCredentialResponse(response) {
    // Google Token: ID_TOKEN
    const body = {
        id_token: response.credential
    };

    fetch(url + 'google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(resp => resp.json())
        .then(({ token, usuario }) => {
            localStorage.setItem('token', token);
            localStorage.setItem('email', usuario.correo);
            window.location = 'chat.html';
        })
        .catch(console.warn)
}

const button = document.getElementById('google_signout');
button.onclick = () => {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}