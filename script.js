// TP1 — Usando la File API (File, FileReader)
const input = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const figure = document.getElementById('figure');
const meta = document.getElementById('meta');
const result = document.getElementById('result');

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

input.addEventListener('change', () => {
  const file = input.files && input.files[0];
  clearPreview();

  if (!file) return;

  // 1) Validación básica: debe ser una imagen
  if (!file.type || !file.type.startsWith('image/')) {
    showError('El archivo seleccionado no es una imagen.');
    return;
  }

  // 2) Validación de tamaño (máximo 10 MB)
  if (file.size > MAX_SIZE) {
    showError('La imagen supera el máximo permitido (10 MB).');
    return;
  }

  // 3) Usamos FileReader para mostrar la imagen
  const reader = new FileReader();
  reader.addEventListener('load', (ev) => {
    preview.src = ev.target.result; // Data URL
    preview.onload = () => {
      figure.classList.remove('hidden');
      const w = preview.naturalWidth;
      const h = preview.naturalHeight;
      meta.textContent = `${file.name} • ${(file.size/1024).toFixed(1)} KB • ${w}×${h}px`;
      showOk('Imagen cargada correctamente.');
    };
  });
  reader.addEventListener('error', () => {
    showError('No se pudo leer el archivo.');
  });
  reader.readAsDataURL(file);
});

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
