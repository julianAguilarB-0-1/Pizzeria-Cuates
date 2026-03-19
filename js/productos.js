
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref as refS, set, onValue, get, child, remove, update } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCVHkQ6Qj-cIaGtYsd87QEFDPvNebczcy8",
    authDomain: "pizzeria-6d9f4.firebaseapp.com",
    databaseURL: "https://pizzeria-6d9f4-default-rtdb.firebaseio.com",
    projectId: "pizzeria-6d9f4",
    storageBucket: "pizzeria-6d9f4.firebasestorage.app",
    messagingSenderId: "970237268337",
    appId: "1:970237268337:web:75e8761a4a674158dd26d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


function formatearPrecio(valor) {
    if (valor === undefined || valor === null || isNaN(valor)) return "N/A";
    return `$${Number(valor).toFixed(2)}`;
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

        contPizzas.innerHTML = "";
        contBebidas.innerHTML = "";
        contAdicionales.innerHTML = "";

        if (!snapshot.exists()) {
            console.log("No hay productos en Pizzeria/");
            return;
        }

        snapshot.forEach((child) => {
            const data = child.val();

            const tipo = (data.tipoProducto || "").toString().trim().toLowerCase();

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

// para el despliegue del menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});