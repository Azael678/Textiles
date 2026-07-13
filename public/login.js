const form = document.getElementById('login-form');
const messageEl = document.getElementById('message');

const showMessage = (text, type = 'error') => {
  messageEl.textContent = text;
  messageEl.className = `alert ${type}`;
  messageEl.style.display = 'block';
};

form.addEventListener('submit', async event => {
  event.preventDefault();
  showMessage('Iniciando sesión...', 'success');

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      showMessage(data.error || 'Error en el login', 'error');
      return;
    }

    // Almacenar el token en el navegador de forma persistente para la sesión
    localStorage.setItem('token', data.token);
    showMessage('Login exitoso. Redirigiendo al panel...', 'success');
    
    // Redirección al Dashboard después de 1 segundo
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);

  } catch (error) {
    showMessage('No se pudo conectar con el servidor.', 'error');
  }
});