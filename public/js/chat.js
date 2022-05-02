const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:3000/api/auth/' : 'heroku';

let usuario = null;
let socket = null;

// Referencias Html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


// Validar el token del LocalStorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    try {
        const resp = await fetch(url, {
            headers: {
                'x-token': token
            }
        });

        const { usuario: userDB, token: tokenDB } = await resp.json();
        localStorage.setItem('token', tokenDB);
        usuario = userDB;
        document.title = usuario.nombre;

        await conectarSocket();
    } catch (error) {
        console.error(error);
    }


}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('[RestServerApp] Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('[RestServerApp] Sockets offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dibujarMensajesPrivados);
}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';
    usuarios.forEach(({ nombre, uid }) => {

        usersHtml += `
        
        <li>
            <p>
                <h5 class="text-success"> ${nombre} </h5>
                <span class="fs-6 text-muted" >${uid}</span>
            </p>
        </li>
        
        `;

    });

    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {

        mensajesHtml += `
        
        <li>
            <p>
                <span class="text-primary"> ${nombre} </span>
                <span >${mensaje}</span>
            </p>
        </li>
        
        `;

    });

    ulMensajes.innerHTML = mensajesHtml;
}

const dibujarMensajesPrivados = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {

        mensajesHtml += `
        
        <li>
            <p>
                <span class="text-secondary">Privado: ${nombre} </span>
                <span >${mensaje}</span>
            </p>
        </li>
        
        `;

    });

    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';
})


const main = async() => {


    //Validar JWT
    await validarJWT()

}


main();