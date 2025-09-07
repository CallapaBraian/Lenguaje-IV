// File API + Drag & Drop + FileReader (variables y funciones en español)

// --- Referencias a elementos del DOM ---
const zonaArrastre     = document.getElementById('dropzone');
const entradaArchivo   = document.getElementById('fileInput');
const vistaPrevia      = document.getElementById('preview');
const contenedorImagen = document.getElementById('figure');
const metadatosImagen  = document.getElementById('meta');
const mensajeResultado = document.getElementById('result');

// Límite de tamaño (10 MB)
const TAM_MAXIMO = 10 * 1024 * 1024;

// --- Click / selección de archivo ---
entradaArchivo.addEventListener('change', () => {
  const archivo = entradaArchivo.files && entradaArchivo.files[0];
  if (archivo) manejarArchivo(archivo);
});

// Hacer que clic en la tarjeta abra el selector
zonaArrastre.addEventListener('click', () => entradaArchivo.click());

// Accesible por teclado (Enter o Space)
zonaArrastre.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    entradaArchivo.click();
  }
});

// --- Drag & Drop ---
['dragenter', 'dragover'].forEach((evento) =>
  zonaArrastre.addEventListener(evento, (e) => {
    e.preventDefault();
    e.stopPropagation();
    zonaArrastre.classList.add('hover');
  })
);

['dragleave', 'dragend', 'drop'].forEach((evento) =>
  zonaArrastre.addEventListener(evento, (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (evento !== 'drop') zonaArrastre.classList.remove('hover');
  })
);

zonaArrastre.addEventListener('drop', (e) => {
  zonaArrastre.classList.remove('hover');
  const dt = e.dataTransfer;
  const archivo = dt?.items?.length
    ? obtenerPrimerArchivo(dt.items)
    : dt?.files?.[0];
  if (archivo) manejarArchivo(archivo);
});

// --- Helpers ---
function obtenerPrimerArchivo(items) {
  for (const item of items) {
    if (item.kind === 'file') return item.getAsFile();
  }
  return null;
}

function manejarArchivo(archivo) {
  limpiarVistaPrevia();

  // 1) Validación tipo
  if (!archivo.type || !archivo.type.startsWith('image/')) {
    return mostrarError('El archivo seleccionado no es una imagen.');
  }

  // 2) Validación tamaño
  if (archivo.size > TAM_MAXIMO) {
    return mostrarError('La imagen supera el máximo permitido (10 MB).');
  }

  // 3) Mostrar
  const lector = new FileReader();
  lector.addEventListener('load', (ev) => {
    vistaPrevia.src = ev.target.result; // Data URL
    vistaPrevia.onload = () => {
      contenedorImagen.classList.remove('hidden');
      const ancho = vistaPrevia.naturalWidth;
      const alto  = vistaPrevia.naturalHeight;
      metadatosImagen.textContent =
        `${archivo.name} • ${(archivo.size / 1024).toFixed(1)} KB • ${ancho}×${alto}px`;
      mostrarOk('Imagen cargada correctamente.');
    };
  });
  lector.addEventListener('error', () => mostrarError('No se pudo leer el archivo.'));
  lector.readAsDataURL(archivo);
}

function limpiarVistaPrevia() {
  mensajeResultado.textContent = '';
  mensajeResultado.classList.remove('ok', 'err');
  metadatosImagen.textContent = '';
  vistaPrevia.removeAttribute('src');
  contenedorImagen.classList.add('hidden');
}

function mostrarError(msg) {
  mensajeResultado.textContent = msg;
  mensajeResultado.classList.remove('ok');
  mensajeResultado.classList.add('err');
}

function mostrarOk(msg) {
  mensajeResultado.textContent = msg;
  mensajeResultado.classList.remove('err');
  mensajeResultado.classList.add('ok');
}
