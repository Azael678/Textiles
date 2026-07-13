const token = localStorage.getItem('token');

if (!token) {
  alert('Acceso denegado. Inicia sesión.');
  window.location.href = '/';
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

let editId = null; // Controla si estamos creando o editando

// Cargar todas las telas al iniciar
document.addEventListener('DOMContentLoaded', cargarTelas);

async function cargarTelas() {
  const res = await fetch('/telas', { headers });
  const telas = await res.json();
  renderTabla(telas);
}

// Registrar o Actualizar tela
document.getElementById('form-tela').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = JSON.stringify({
    nombre_tela: document.getElementById('nombre').value,
    metros_tela: parseFloat(document.getElementById('metros').value),
    color_tela: document.getElementById('color').value,
    calidad_tela: document.getElementById('calidad').value
  });

  if (editId) {
    // Si hay un ID en memoria, actualizamos
    await fetch(`/telas/${editId}`, { method: 'PUT', headers, body });
    editId = null;
    document.querySelector('#form-tela button').textContent = 'Registrar Tela';
  } else {
    // Si no hay ID, creamos uno nuevo
    await fetch('/telas', { method: 'POST', headers, body });
  }
  
  e.target.reset();
  cargarTelas();
});

// Preparar formulario para edición
window.editarTela = function(id, nombre, metros, color, calidad) {
  document.getElementById('nombre').value = nombre;
  document.getElementById('metros').value = metros;
  document.getElementById('color').value = color;
  document.getElementById('calidad').value = calidad;
  
  editId = id;
  document.querySelector('#form-tela button').textContent = 'Actualizar Tela';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Eliminar con confirmación
async function eliminarTela(id) {
  if (confirm(`¿Estás seguro de eliminar el registro ${id}?`)) {
    await fetch(`/telas/${id}`, { method: 'DELETE', headers });
    cargarTelas();
  }
}

// Buscar por ID o Nombre
async function buscarTelas() {
  const query = document.getElementById('search').value;
  if (!query) return cargarTelas();

  // Intenta buscar por nombre, si falla, buscará por ID según tus rutas
  let res = await fetch(`/telas/buscar/${query}`, { headers });
  if (res.status === 404) {
    res = await fetch(`/telas/${query}`, { headers });
  }
  
  const data = await res.json();
  // Convierte objeto único en arreglo para la tabla si es búsqueda por ID
  renderTabla(Array.isArray(data) ? data : (data.error ? [] : [data]));
}

// Descargar PDF procesando el Blob con Auth
async function descargarPDF() {
  const res = await fetch('/telas/reporte/pdf', { headers });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reporte_telas.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function renderTabla(telas) {
  const tbody = document.getElementById('tabla-telas');
  tbody.innerHTML = '';
  telas.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.id_tela}</td>
        <td>${t.nombre_tela}</td>
        <td>${t.color_tela}</td>
        <td>${t.metros_tela}</td>
        <td>${t.calidad_tela}</td>
        <td>
          <button style="background: #ffc107; color: black;" onclick="editarTela('${t.id_tela}', '${t.nombre_tela}', ${t.metros_tela}, '${t.color_tela}', '${t.calidad_tela}')">Editar</button>
          <button class="btn-danger" onclick="eliminarTela('${t.id_tela}')">Eliminar</button>
        </td>
      </tr>
    `;
  });
}