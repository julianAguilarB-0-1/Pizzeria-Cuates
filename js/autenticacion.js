// Importar librería de Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Configuración del proyecto Supabase
const SUPABASE_URL = "https://uhnnwjztvnittyhoxfwk.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobm53anp0dm5pdHR5aG94ZndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTc5NjQsImV4cCI6MjA3ODA5Mzk2NH0.tjnFvEgOZ9FTtNTw8MvCGOtSJS_W4R6syQHqot2Ls9Q";

// Crear cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Referencias del HTML
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mensaje = document.getElementById("mensaje");
const btnLogin = document.getElementById("btnLogin");


// Iniciar sesión
btnLogin.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    mensaje.textContent = "Por favor ingresa correo y contraseña.";
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    mensaje.textContent = "Error: " + error.message;
  } else {
    mensaje.textContent = "Bienvenido " + data.user.email;
    // Cambiar a admin
    window.location.href = "https://pizzeria-cuates.netlify.app/html/adminproducto";
  }
});
