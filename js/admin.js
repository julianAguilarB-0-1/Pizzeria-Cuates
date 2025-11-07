import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { getDatabase, onValue, ref as refS, set, child, get, update, remove }
    from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Configuracion de la cuenta
const firebaseConfig = {
    apiKey: "AIzaSyA5pisgK31mDQnqUSBlccZZTcGPsvgpbLs",
    authDomain: "proyectowebfinal-ee0c5.firebaseapp.com",
    databaseURL: "https://proyectowebfinal-ee0c5-default-rtdb.firebaseio.com",
    projectId: "proyectowebfinal-ee0c5",
    storageBucket: "proyectowebfinal-ee0c5.firebasestorage.app",
    messagingSenderId: "1085156049377",
    appId: "1:1085156049377:web:d437c5151a5cd5dbad12a0"
};

// Iniciar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/// Variables globales
var tipoProducto = "";
var nombre = "";
var descripcion = "";
var urlImg = "";
var costo = 0;

// funciones
function leerInputs() {
    tipoProducto = document.getElementById('tipo').value.trim();
    nombre = document.getElementById('txtNombre').value.trim();
    descripcion = document.getElementById('txtDescripcion').value.trim();
    urlImg = document.getElementById('txtUrl').value.trim();
    costo = parseFloat(document.getElementById('txtPrecio').value);
}

function escribirInputs() {
    document.getElementById('tipo').value = tipoProducto;
    document.getElementById('txtDescripcion').value = descripcion;
    document.getElementById('txtUrl').value = urlImg;
    document.getElementById('txtPrecio').value = costo;
}

function mostrarMensaje(mensaje) {
    var mensajeElement = document.getElementById('mensaje');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.display = 'block';
    setTimeout(() => {
        mensajeElement.style.display = 'none';
    }, 1500);
}

function limpiarInputs() {
    document.getElementById('tipo').value = '';
    document.getElementById('txtNombre').value = '';
    document.getElementById('txtDescripcion').value = '';
    document.getElementById('txtUrl').value = '';
    document.getElementById('txtPrecio').value = 0
}

// Evento de Insertar
const btnAgregar = document.getElementById('btnAgregar');
btnAgregar.addEventListener('click', insertarProducto);

// Funcion para insertar
function insertarProducto() {
    leerInputs();

    // Validación de campos
    if (tipoProducto === "" || nombre === "" || descripcion === "" || urlImg === "") {
        mostrarMensaje("Faltaron datos por capturar");
        return;
    } else if (costo <= 0) {
        mostrarMensaje("El precio no puede ser menor que cero.");
        return
    }

    // Insertar en Firebase
    set(
        refS(db, 'Pizzeria/' + nombre),
        {
            tipoProducto: tipoProducto,
            nombre: nombre,
            descripcion: descripcion,
            urlImg: urlImg,
            costo: costo
        }
    ).then(() => {
        alert("Producto agregado con éxito");
        limpiarInputs();
        Listarproductos();
    }).catch((error) => {
        alert("Ocurrió un error al agregar el producto");
        console.error(error);
    });
}

//Listar productos 
document.addEventListener("DOMContentLoaded", Listarproductos());

function Listarproductos() {
    const dbRef = refS(db, 'Pizzeria/');
    const tabla = document.getElementById('tablaProductos');
    const tbody = tabla.querySelector('tbody');
    tbody.innerHTML = '';

    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const data = childSnapshot.val();

            var fila = document.createElement('tr');

            var celdaTipo = document.createElement('td');
            celdaTipo.textContent = data.tipoProducto;
            fila.appendChild(celdaTipo);

            var celdaNombre = document.createElement('td');
            celdaNombre.textContent = data.nombre;
            fila.appendChild(celdaNombre);

            var celdaDescripcion = document.createElement('td');
            celdaDescripcion.textContent = data.descripcion;
            fila.appendChild(celdaDescripcion);

            var celdaImagen = document.createElement('td');
            var imagen = document.createElement('img');
            imagen.src = data.urlImg;
            imagen.width = 100;
            celdaImagen.appendChild(imagen);
            fila.appendChild(celdaImagen);

            var celdaPrecio = document.createElement('td');
            celdaPrecio.textContent = "$ " + data.costo;
            fila.appendChild(celdaPrecio);

            tbody.appendChild(fila);
        });
    }, { onlyOnce: true });
}

//Funcion Eliminar
function eliminarAutomovil() {
    let nombre = document.getElementById('txtNombre').value.trim();
    if (nombre === "") {
        mostrarMensaje("No se ingresó un nombre válido.");
        return;
    }
    const dbref = refS(db);
    get(child(dbref, 'Pizzeria/' + nombre)).then((snapshot) => {
        if (snapshot.exists()) {
            remove(refS(db, 'Pizzeria/' + nombre))
                .then(() => {
                    alert("Producto eliminado con éxito.");
                    mostrarMensaje("Producto encontrado para borrar");
                    limpiarInputs();
                    Listarproductos();
                })
                .catch((error) => {
                    mostrarMensaje("Ocurrió un error al eliminar el producto: " + error);
                });
        } else {
            limpiarInputs();
            mostrarMensaje("El producto de nombre " + nombre + " no existe.");
        }
    });
    Listarproductos();
}

const btnBorrar = document.getElementById('btnBorrar');
btnBorrar.addEventListener('click', eliminarAutomovil);

//Funcion de Buscar
//Evento
const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', buscarProducto);

function buscarProducto() {
    let nombre = document.getElementById('txtNombre').value.trim();
    if (nombre === "") {
        mostrarMensaje("No se ingreso nombre");
        return;
    }

    const dbref = refS(db);
    get(child(dbref, 'Pizzeria/' + nombre)).then((snapshot) => {
        if (snapshot.exists()) {
            descripcion = snapshot.val().descripcion;
            costo = snapshot.val().costo;
            tipoProducto = snapshot.val().tipoProducto;
            urlImg = snapshot.val().urlImg;
            escribirInputs();
        } else {
            limpiarInputs();
            mostrarMensaje("El producto con código " + nombre + " no existe.");
        }
    })
}

//Funcion para actualizar
function actualizarAutomovil() {

    leerInputs();
    if (tipoProducto === "" || nombre === "" || descripcion === "" || urlImg === "") {
        mostrarMensaje("Capture toda la informacion");
        return;
    } else if (costo <= 0) {
        mostrarMensaje("El precio no puede ser menor que cero.");
        return
    }
    alert("Actualizado");
    update(refS(db, 'Pizzeria/' + nombre), {
        tipoProducto: tipoProducto,
        nombre: nombre,
        descripcion: descripcion,
        urlImg: urlImg,
        costo: costo
    }).then(() => {
        mostrarMensaje("Se actualizo con exito.");
        limpiarInputs();
        Listarproductos();
    }).catch((error) => {
        mostrarMensaje("Ocurrio un error: " + error);
    });
}

const btnActualizar = document.getElementById('btnActualizar');
btnActualizar.addEventListener('click', actualizarAutomovil);

// Subir imagenes

// Cuenta Cloudinary
const cloudName = "dk1sj8yj3"; // tu cloud name
const uploadPreset = "Pizzeria"; // cambia este preset para pizzas en tu cuenta Cloudinary

// Constantes
const imageInput = document.getElementById('imageInput');
const uploadButton = document.getElementById('uploadButton');

// Evento para subir imagen
uploadButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Evita recarga del formulario
    e.stopPropagation();

    const file = imageInput.files[0];

    if (!file) {
        alert("Selecciona una imagen antes de subir.");
        return;
    }

    // Preparar datos para Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.secure_url) {
            document.getElementById("txtUrl").value = data.secure_url;
            alert("Imagen subida correctamente");
        } else {
            alert("Error al subir la imagen");
            console.error(data);
        }
    } catch (error) {
        console.error("Error al subir a Cloudinary:", error);
        alert("Ocurrió un error al subir la imagen.");
    }
});

//registro usuario nuevo
// Registrar usuario

const btnRegistro = document.getElementById("btnRegistro");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mensaje = document.getElementById("mensaje2");

btnRegistro.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    mensaje.textContent = "Por favor ingresa correo y contraseña.";
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    mensaje.textContent = "Error: " + error.message;
  } else {
    mensaje.textContent = "Registro exitoso. Verifica tu correo: " + data.user.email;
  }
});
