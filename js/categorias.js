async function renderCategorias() {
  document.getElementById("main-content").innerHTML = `
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-800">Categorías</h1>
      <p class="text-sm text-gray-400">Administrá tus categorías de gastos</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100">

      <!-- HEADER -->
      <div class="flex justify-between items-center p-5 border-b border-gray-50">
        <span class="text-sm font-medium text-gray-800">Listado de categorías</span>
        <button  onclick="mostrarFormularioCategoria()" class="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg">+ Agregar</button>
      </div>

      <!-- GRID DE CATEGORIAS -->
      <div id="grid-categorias" class="grid grid-cols-2 gap-3 p-5 md:grid-cols-4"></div>

      <!-- FORMULARIO INLINE -->
      <div id="formulario-categoria" class="hidden bg-gray-50 border-t border-gray-100 p-5">
        <p class="text-sm font-medium text-gray-800 mb-4" id="form-titulo-cat">Nueva categoría</p>
        <div class="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Nombre</label>
            <input id="input-nombre-cat" type="text" placeholder="Ej: Educación" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Ícono (emoji)</label>
            <input id="input-icono-cat" type="text" placeholder="Ej: 📚" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label class="text-xs text-gray-400 mb-1 block">Color</label>
            <input id="input-color-cat" type="color" value="#eef2ff" class="w-full h-9 border border-gray-200 rounded-lg px-1 py-1 cursor-pointer" />
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button  onclick="ocultarFormularioCategoria()" class="text-xs bg-gray-100 text-gray-500 px-4 py-2 rounded-lg">Cancelar</button>
          <button  onclick="guardarCategoria()" class="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg">Guardar</button>
        </div>
      </div>

    </div>
  `;

  await cargarCategorias();
}

let categoriaEditandoId = null;

async function cargarCategorias() {
  const res = await api.getCategorias();
  const categorias = res.data;

  const grid = document.getElementById("grid-categorias");
  grid.innerHTML = "";

  for (let i = 0; i < categorias.length; i++) {
    const cat = categorias[i];
    grid.innerHTML += `
      <div class="rounded-xl border border-gray-100 p-4 flex flex-col items-center text-center gap-2" style="background-color:${cat.color}">
        <span class="text-2xl">${cat.icono}</span>
        <span class="text-sm font-medium text-gray-700">${cat.nombre}</span>
        <div class="flex gap-2 mt-1">
          <button  onclick="editarCategoria('${cat.id}')" class="bg-white text-blue-600 px-2 py-1 rounded-lg text-xs">✏️</button>
          <button  onclick="eliminarCategoria('${cat.id}')" class="bg-white text-red-500 px-2 py-1 rounded-lg text-xs">🗑️</button>
        </div>
      </div>
    `;
  }
}

function mostrarFormularioCategoria() {
  categoriaEditandoId = null;
  document.getElementById("form-titulo-cat").textContent = "Nueva categoría";
  document.getElementById("input-nombre-cat").value = "";
  document.getElementById("input-icono-cat").value = "";
  document.getElementById("input-color-cat").value = "#eef2ff";
  document.getElementById("formulario-categoria").classList.remove("hidden");
}

function ocultarFormularioCategoria() {
  document.getElementById("formulario-categoria").classList.add("hidden");
}

async function guardarCategoria() {
  const nombre = document.getElementById("input-nombre-cat").value;
  const icono = document.getElementById("input-icono-cat").value;
  const color = document.getElementById("input-color-cat").value;

  if (!nombre || !icono) {
    alert("Completá todos los campos");
    return;
  }

  const categoria = { nombre, icono, color };

  if (categoriaEditandoId) {
    await api.updateCategorias(categoriaEditandoId, categoria);
  } else {
    await api.createCategorias(categoria);
  }

  ocultarFormularioCategoria();
  await cargarCategorias();
}

async function editarCategoria(id) {
  const res = await api.getCategorias();
  const categoria = res.data.find(function (c) {
    return String(c.id) === String(id);
  });

  categoriaEditandoId = id;
  document.getElementById("form-titulo-cat").textContent = "Editar categoría";
  document.getElementById("input-nombre-cat").value = categoria.nombre;
  document.getElementById("input-icono-cat").value = categoria.icono;
  document.getElementById("input-color-cat").value = categoria.color;
  document.getElementById("formulario-categoria").classList.remove("hidden");
}

async function eliminarCategoria(id) {
  if (confirm("¿Eliminar categoría?")) {
    await api.deleteCategorias(id);
    await cargarCategorias();
  }
}
