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

function formatearPrecio(valor) {
    if (valor === undefined || valor === null || isNaN(valor)) return "N/A";
    return `$${Number(valor).toFixed(2)}`;
}

function crearTarjeta(data) {
    const url = data.urlImg || "";
    const nombre = data.nombre || "Sin nombre";
    const descripcion = data.descripcion || "";
    const precio = formatearPrecio(data.costo);

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-pizza";

    tarjeta.innerHTML = `
        <img class="imagen-pizza" src="${url}" alt="${nombre}" loading="lazy" width="250" onerror="this.src='/assets/placeholder.png'">
        <h3 class="nombre-pizza">${nombre}</h3>
        <p class="desc-pizza">${descripcion}</p>
        <div class="pie-tarjeta">
            <span class="precio-pizza">${precio}</span>
        </div>`;
    return tarjeta;
}

function cargarPizzasPorTipo() {
    console.log("Cargando Pizzeria desde Firebase...");
    const dbRef = refS(db, "Pizzeria/");

    const contPizzas = document.getElementById("contenedorPizzas");
    const contBebidas = document.getElementById("contenedorBebidas");
    const contAdicionales = document.getElementById("contenedorAdicionales");

    if (!contPizzas || !contBebidas || !contAdicionales) {
        console.error("No se encontraron uno o más contenedores de destino en el HTML.");
        return;
    }

    contPizzas.innerHTML = "";
    contBebidas.innerHTML = "";
    contAdicionales.innerHTML = "";

    onValue(dbRef, (snapshot) => {
        if (!snapshot.exists()) {
            console.log("No hay productos en Pizzeria/");
            return;
        }

        snapshot.forEach((child) => {
            const data = child.val();

            const tipo = (data.tipoProducto || "").toString().trim().toLowerCase();

            const tarjeta = crearTarjeta(data);

            if (tipo === "pizza" || tipo === "pizzas") {
                contPizzas.appendChild(tarjeta);
            } else if (tipo === "bebida" || tipo === "bebidas") {
                contBebidas.appendChild(tarjeta);
            } else if (tipo === "adicional" || tipo === "adicionales" || tipo === "extra") {
                contAdicionales.appendChild(tarjeta);
            } else {
                console.warn("Tipo no reconocido para:", child.key, data);
                contPizzas.appendChild(tarjeta);
            }
        });
    }, (error) => {
        console.error("Error al leer Pizzeria/:", error);
    });
}

window.addEventListener("load", cargarPizzasPorTipo);
