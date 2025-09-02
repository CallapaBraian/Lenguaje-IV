// File API + Drag & Drop (sección dedicada)
const dz      = document.getElementById('dropzone');
const input   = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const figure  = document.getElementById('figure');
const meta    = document.getElementById('meta');
const result  = document.getElementById('result');

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// --- Click / selección de archivo ---
input.addEventListener('change', () => {
  const file = input.files && input.files[0];
  if (file) handleFile(file);
});

// Hacer que clic en la tarjeta abra el selector
dz.addEventListener('click', () => input.click());

// Accesible por teclado (Enter o Space)
dz.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    input.click();
  }
});

// --- Drag & Drop ---
['dragenter', 'dragover'].forEach(evt =>
  dz.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dz.classList.add('hover');
  })
);

['dragleave', 'dragend', 'drop'].forEach(evt =>
  dz.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    if (evt !== 'drop') dz.classList.remove('hover');
  })
);

dz.addEventListener('drop', e => {
  dz.classList.remove('hover');
  const dt = e.dataTransfer;
  const file = dt?.items?.length ? getFirstFile(dt.items) : (dt?.files?.[0]);
  if (file) handleFile(file);
});

// --- Helpers ---
function getFirstFile(items) {
  for (const item of items) {
    if (item.kind === 'file') return item.getAsFile();
  }
  return null;
}

function handleFile(file) {
  clearPreview();

  // 1) Validación tipo
  if (!file.type || !file.type.startsWith('image/')) {
    return showError('El archivo seleccionado no es una imagen.');
  }

  // 2) Validación tamaño
  if (file.size > MAX_SIZE) {
    return showError('La imagen supera el máximo permitido (10 MB).');
  }

  // 3) Mostrar
  const reader = new FileReader();
  reader.addEventListener('load', ev => {
    preview.src = ev.target.result; // Data URL
    preview.onload = () => {
      figure.classList.remove('hidden');
      const w = preview.naturalWidth;
      const h = preview.naturalHeight;
      meta.textContent = `${file.name} • ${(file.size/1024).toFixed(1)} KB • ${w}×${h}px`;
      showOk('Imagen cargada correctamente.');
    };
  });
  reader.addEventListener('error', () => showError('No se pudo leer el archivo.'));
  reader.readAsDataURL(file);
}

function clearPreview() {
  result.textContent = '';
  result.classList.remove('ok', 'err');
  meta.textContent = '';
  preview.removeAttribute('src');
  figure.classList.add('hidden');
}

function showError(msg) {
  result.textContent = msg;
  result.classList.remove('ok');
  result.classList.add('err');
}

function showOk(msg) {
  result.textContent = msg;
  result.classList.remove('err');
  result.classList.add('ok');
}
